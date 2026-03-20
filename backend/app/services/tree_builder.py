import os
from typing import Any, Optional


CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".c", ".cpp", ".h", ".hpp",
    ".cs", ".go", ".rs", ".rb", ".php", ".swift", ".kt", ".scala", ".r",
    ".vue", ".svelte", ".html", ".css", ".scss", ".sass", ".less",
    ".sh", ".bash", ".zsh", ".fish", ".ps1", ".sql", ".graphql",
}

RESOURCE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp", ".avif",
    ".mp4", ".mp3", ".wav", ".ogg", ".webm",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".zip", ".tar", ".gz", ".7z", ".rar",
    ".ttf", ".woff", ".woff2", ".eot",
}

DOC_EXTENSIONS = {
    ".md", ".mdx", ".rst", ".txt", ".csv", ".json", ".yaml", ".yml",
    ".toml", ".ini", ".cfg", ".conf", ".env", ".xml",
}


def get_extension(filename: str) -> Optional[str]:
    """Get file extension, lowercased."""
    _, ext = os.path.splitext(filename)
    return ext.lower() if ext else None


def get_file_category(extension: Optional[str]) -> str:
    """Categorize file by extension."""
    if extension is None:
        return "other"
    if extension in CODE_EXTENSIONS:
        return "code"
    if extension in RESOURCE_EXTENSIONS:
        return "resource"
    if extension in DOC_EXTENSIONS:
        return "doc"
    return "other"


def flatten_entries(entries: list[dict], parent_path: str = "") -> list[dict]:
    """Recursively flatten nested GraphQL tree entries into a flat list."""
    result = []
    for entry in entries:
        result.append(entry)
        if entry.get("type") == "tree":
            sub_entries = entry.get("object", {}).get("entries", []) if entry.get("object") else []
            result.extend(flatten_entries(sub_entries, entry.get("path", "")))
    return result


def build_tree_from_entries(entries: list[dict], repo_name: str) -> dict[str, Any]:
    """Build a nested tree structure from flat GraphQL entries."""
    # Create root node
    root: dict[str, Any] = {
        "name": repo_name,
        "path": "",
        "type": "directory",
        "size": 0,
        "extension": None,
        "metadata": {
            "totalFiles": 0,
            "codeFiles": 0,
            "resourceFiles": 0,
            "docFiles": 0,
            "otherFiles": 0,
            "codeRatio": 0.0,
            "resourceRatio": 0.0,
        },
        "children": [],
    }

    # Index nodes by path
    nodes: dict[str, dict[str, Any]] = {"": root}

    # First pass: create all nodes
    flat_entries = flatten_entries(entries)

    for entry in flat_entries:
        path = entry.get("path", "")
        name = entry.get("name", "")
        entry_type = entry.get("type", "blob")
        obj = entry.get("object") or {}

        if entry_type == "blob":
            byte_size = obj.get("byteSize", 0) or 0
            ext = get_extension(name)
            category = get_file_category(ext)
            node: dict[str, Any] = {
                "name": name,
                "path": path,
                "type": "file",
                "size": byte_size,
                "extension": ext,
                "metadata": {
                    "category": category,
                    "isBinary": obj.get("isBinary", False),
                },
                "children": None,
            }
        else:
            # Directory
            node = {
                "name": name,
                "path": path,
                "type": "directory",
                "size": 0,
                "extension": None,
                "metadata": {
                    "totalFiles": 0,
                    "codeFiles": 0,
                    "resourceFiles": 0,
                    "docFiles": 0,
                    "otherFiles": 0,
                    "codeRatio": 0.0,
                    "resourceRatio": 0.0,
                },
                "children": [],
            }

        nodes[path] = node

    # Second pass: link parent-child
    for path, node in nodes.items():
        if path == "":
            continue
        parent_path = os.path.dirname(path)
        parent = nodes.get(parent_path, root)
        if parent.get("children") is not None:
            parent["children"].append(node)

    # Third pass: aggregate sizes and ratios bottom-up
    _aggregate(root)

    return root


def _aggregate(node: dict[str, Any]) -> None:
    """Post-order traversal: compute totalSize, codeRatio, resourceRatio."""
    if node.get("children") is None:
        # Leaf
        return

    total_size = 0
    code_files = 0
    resource_files = 0
    doc_files = 0
    other_files = 0
    total_files = 0

    for child in node["children"]:
        _aggregate(child)
        total_size += child["size"]
        if child["type"] == "file":
            total_files += 1
            cat = child.get("metadata", {}).get("category", "other")
            if cat == "code":
                code_files += 1
            elif cat == "resource":
                resource_files += 1
            elif cat == "doc":
                doc_files += 1
            else:
                other_files += 1
        else:
            # Aggregate from subdirectory
            sub_meta = child.get("metadata", {})
            total_files += sub_meta.get("totalFiles", 0)
            code_files += sub_meta.get("codeFiles", 0)
            resource_files += sub_meta.get("resourceFiles", 0)
            doc_files += sub_meta.get("docFiles", 0)
            other_files += sub_meta.get("otherFiles", 0)

    node["size"] = total_size
    node["metadata"] = {
        "totalFiles": total_files,
        "codeFiles": code_files,
        "resourceFiles": resource_files,
        "docFiles": doc_files,
        "otherFiles": other_files,
        "codeRatio": round(code_files / total_files, 4) if total_files > 0 else 0.0,
        "resourceRatio": round(resource_files / total_files, 4) if total_files > 0 else 0.0,
    }
