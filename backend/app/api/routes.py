import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.core.config import settings
from app.core.redis_client import get_cached, set_cached
from app.services.github_client import RateLimitError, fetch_repo_tree, parse_github_url
from app.services.tree_builder import build_tree_from_entries

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/analyze")
async def analyze_repo(
    repo_url: str = Query(..., description="GitHub repository URL"),
):
    """
    Analyze a GitHub repository and return its file tree structure.

    Returns a nested JSON tree compatible with D3.js hierarchy.
    """
    # Parse URL
    try:
        owner, repo = parse_github_url(repo_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Check cache
    cached_data = get_cached(repo_url)
    if cached_data:
        logger.info(f"Cache hit for {repo_url}")
        cached_data["cached"] = True
        return cached_data

    # Fetch from GitHub
    try:
        result = await fetch_repo_tree(owner, repo)
    except RateLimitError as e:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "rate_limit_exceeded",
                "message": str(e),
                "hint": "Please wait for the rate limit to reset or provide a GitHub token with higher rate limits.",
            },
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching repo {repo_url}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch repository: {str(e)}")

    # Build tree
    tree = build_tree_from_entries(result["entries"], repo)

    response_data = {
        "repo_url": repo_url,
        "owner": owner,
        "repo": repo,
        "default_branch": result["default_branch"],
        "tree": tree,
        "cached": False,
    }

    # Cache the result
    set_cached(repo_url, response_data, ttl=settings.cache_ttl)

    return response_data


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "gitmap-backend"}
