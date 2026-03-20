from pydantic import BaseModel
from typing import Any, Optional


class AnalyzeRequest(BaseModel):
    repo_url: str


class TreeNode(BaseModel):
    name: str
    path: str
    size: int
    type: str  # "file" or "directory"
    extension: Optional[str] = None
    metadata: Optional[dict[str, Any]] = None
    children: Optional[list["TreeNode"]] = None

    model_config = {"populate_by_name": True}


TreeNode.model_rebuild()


class AnalyzeResponse(BaseModel):
    repo_url: str
    owner: str
    repo: str
    default_branch: str
    tree: TreeNode
    cached: bool = False
