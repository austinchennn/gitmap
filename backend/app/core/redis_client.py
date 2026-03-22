import hashlib
import json
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)

_redis_client = None


def get_redis():
    global _redis_client
    if _redis_client is None:
        try:
            import redis as redis_lib
            from app.core.config import settings
            _redis_client = redis_lib.from_url(settings.redis_url, decode_responses=True)
            _redis_client.ping()
        except Exception as e:
            logger.warning(f"Redis unavailable: {e}. Caching disabled.")
            _redis_client = None
    return _redis_client


def make_cache_key(repo_url: str) -> str:
    return "gitmap:" + hashlib.sha256(repo_url.encode()).hexdigest()


def get_cached(repo_url: str) -> Optional[Any]:
    r = get_redis()
    if r is None:
        return None
    try:
        key = make_cache_key(repo_url)
        data = r.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        logger.warning(f"Cache get error: {e}")
    return None


def set_cached(repo_url: str, data: Any, ttl: int = 86400) -> None:
    r = get_redis()
    if r is None:
        return
    try:
        key = make_cache_key(repo_url)
        r.setex(key, ttl, json.dumps(data))
    except Exception as e:
        logger.warning(f"Cache set error: {e}")
