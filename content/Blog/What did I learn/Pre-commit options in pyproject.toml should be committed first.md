---
title: Pre-commit options in pyproject.toml should be committed first
tags:
  - pre-commit
  - pyproject
  - ruff
  - ops
sources: 
date: 2025-03-12
---
# Description

When modifying the pyproject.toml file to add special options for pre-commit, those options are not taken into account until the pyproject.toml has been committed.
# Example

```toml
[tool.ruff]  
line-length = 120  
indent-width = 4  
target-version = "py311"  
extend-unsafe-fixes = ["D"]  
  
[tool.ruff.lint]  
ignore = [  
    # Use `.to_numpy()` instead of `.values` (even when not referring to a pandas DataFrame)  
    "PD011"
]
```

before commit:
```powershell
ruff.....................................................................Failed
- hook id: ruff
- exit code: 1

test.py:5:23: PD011 Use `.to_numpy()` instead of `.values`
```
