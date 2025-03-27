---
title: Beware of poetry package named differently from project structure
tags:
  - poetry
  - ops
  - cicd
sources:
  - https://python-poetry.org/docs/pyproject/#packages
date: 2025-03-27
---
# Description

When installing a Poetry package from a folder, the installation will fail if the package name in `pyproject.toml` does not match the folder structure.
# Example

Consider the following `pyproject.toml` configuration:

```toml
[tool.poetry]
name = "my-package"  
version = "0.1.0"
```

and a project structure like this:

```text
my_project/
├── pyproject.toml
├── README.md
├── .gitignore
├── src/
│   ├── __init__.py
│   ├── module1.py
│   ├── module2.py
│   ├── main.py
├── tests/
├── docs/
```

Attempting to install the project with `poetry install` will result in the following error:
```console
Error: The current project could not be installed: No file/folder found for package my-package
```

### Solutions

You have two options to resolve this issue:
1) **Disable package mode** (if you're only using Poetry for dependency management and don't need to install the project):
	```toml
	[tool.poetry]
	name = "my-package"  
	version = "0.1.0"
	package-mode = false
	```
2) **Explicitly define the package path** (if you do want to install your package):
    ```toml
	[tool.poetry]
	name = "my-package"  
	version = "0.1.0"
	packages = [
	    { include = "my_project" },
	]
	```