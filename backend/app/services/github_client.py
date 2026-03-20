import logging
import re
from typing import Any, Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

# GraphQL query: fetch repo tree with file metadata
REPO_TREE_QUERY = """
query RepoTree($owner: String!, $repo: String!, $expression: String!) {
  rateLimit {
    limit
    remaining
    resetAt
  }
  repository(owner: $owner, name: $repo) {
    defaultBranchRef {
      name
    }
    object(expression: $expression) {
      ... on Tree {
        entries {
          name
          path
          type
          object {
            ... on Blob {
              byteSize
            }
          }
        }
      }
    }
  }
}
"""

# Query to get commit history for a file/folder
COMMIT_HISTORY_QUERY = """
query CommitHistory($owner: String!, $repo: String!, $branch: String!, $path: String!) {
  rateLimit {
    limit
    remaining
    resetAt
  }
  repository(owner: $owner, name: $repo) {
    ref(qualifiedName: $branch) {
      target {
        ... on Commit {
          history(first: 10, path: $path) {
            nodes {
              committedDate
              author {
                name
                email
                user {
                  login
                  avatarUrl
                }
              }
            }
          }
        }
      }
    }
  }
}
"""

# Recursive tree query using Git tree object
GIT_TREE_QUERY = """
query GitTree($owner: String!, $repo: String!) {
  rateLimit {
    limit
    remaining
    resetAt
  }
  repository(owner: $owner, name: $repo) {
    defaultBranchRef {
      name
      target {
        ... on Commit {
          tree {
            entries {
              name
              path
              type
              object {
                ... on Blob {
                  byteSize
                  isBinary
                }
                ... on Tree {
                  entries {
                    name
                    path
                    type
                    object {
                      ... on Blob {
                        byteSize
                        isBinary
                      }
                      ... on Tree {
                        entries {
                          name
                          path
                          type
                          object {
                            ... on Blob {
                              byteSize
                              isBinary
                            }
                            ... on Tree {
                              entries {
                                name
                                path
                                type
                                object {
                                  ... on Blob {
                                    byteSize
                                    isBinary
                                  }
                                  ... on Tree {
                                    entries {
                                      name
                                      path
                                      type
                                      object {
                                        ... on Blob {
                                          byteSize
                                          isBinary
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
"""


def parse_github_url(url: str) -> tuple[str, str]:
    """Extract owner and repo name from a GitHub URL."""
    url = url.strip().rstrip("/")
    # Handle https://github.com/owner/repo and github.com/owner/repo
    pattern = r"(?:https?://)?github\.com/([^/]+)/([^/]+?)(?:\.git)?$"
    match = re.match(pattern, url)
    if not match:
        raise ValueError(f"Invalid GitHub URL: {url}")
    return match.group(1), match.group(2)


async def fetch_repo_tree(owner: str, repo: str) -> dict[str, Any]:
    """Fetch the full repository tree using GitHub GraphQL API."""
    if not settings.github_token:
        raise ValueError("GITHUB_TOKEN is not configured")

    headers = {
        "Authorization": f"Bearer {settings.github_token}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        # First get the default branch
        response = await client.post(
            GITHUB_GRAPHQL_URL,
            headers=headers,
            json={
                "query": GIT_TREE_QUERY,
                "variables": {"owner": owner, "repo": repo},
            },
        )
        response.raise_for_status()
        data = response.json()

    if "errors" in data:
        error_msgs = [e.get("message", "Unknown error") for e in data["errors"]]
        raise ValueError(f"GitHub API errors: {'; '.join(error_msgs)}")

    rate_limit = data.get("data", {}).get("rateLimit", {})
    remaining = rate_limit.get("remaining", 100)
    if remaining <= 0:
        reset_at = rate_limit.get("resetAt", "unknown")
        raise RateLimitError(f"GitHub API rate limit exceeded. Resets at {reset_at}")

    repo_data = data.get("data", {}).get("repository")
    if not repo_data:
        raise ValueError(f"Repository {owner}/{repo} not found or not accessible")

    default_branch_ref = repo_data.get("defaultBranchRef")
    if not default_branch_ref:
        raise ValueError(f"Repository {owner}/{repo} has no default branch")

    default_branch = default_branch_ref.get("name", "main")
    tree_target = default_branch_ref.get("target", {})
    tree_data = tree_target.get("tree", {})
    entries = tree_data.get("entries", [])

    return {
        "default_branch": default_branch,
        "entries": entries,
    }


class RateLimitError(Exception):
    pass
