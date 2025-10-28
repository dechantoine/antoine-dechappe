---
title: Fix Intermittent uv 401 Errors with GCP Artifact Registry
tags:
  - uv
  - keyring
  - gcp
sources:
  - https://docs.astral.sh/uv/concepts/cache/#clearing-the-cache
date: 2025-10-28
---
# Description

You may encounter a `401 Unauthorized` error when trying to install a package from a private GCP Artifact Registry repository using `uv`.

The most confusing part of this issue is that it can suddenly appear in **one specific project, while all other projects on the same machine continue to work perfectly**. 

This happens even when your `gcloud` configuration (`gcloud config list`) and IAM permissions (`roles/artifactregistry.reader`) are correct (you may check this with `gcloud artifacts packages list --project="your-project" --repository="your-repo" --location="your-location"`)

The root cause is often a **stale credential cache** within `uv`'s global cache or a corrupted local `.venv`. `uv` may be holding onto an expired or invalid token for that specific repository, and it fails to re-fetch the valid Application Default Credentials (ADC).

# Example

Running `uv add` or `uv sync` in a single project fails with the following error, while other projects authenticate successfully:

```console
(my-project-venv) $ uv add your-private-package
---
  • Resolving dependencies
  • Adding my-private-package
---
  × No solution found when resolving dependencies for split:
	╰─▶ Because there is no version of your-private-package and your project depends on your-private-package, we can conclude that your project's requirements are unsatisfiable.

	hint: An index URL (https://your-location-python.pkg.dev/your-project/your-repo/simple/) could not be queried due to a lack of valid authentication credentials (401 Unauthorized).
```

# Solution

The fix is to force `uv` to clear its caches and rebuild the environment from a clean state. This "nuke and rebuild" approach clears any stale credentials and forces `uv` to re-authenticate using your valid `gcloud` ADC.

1. **Clean the global `uv` cache:** This command clears all cached package metadata and credentials.
    ```bash
    uv cache clean
    ```

2. **Remove the project's local virtual environment:** This ensures no corrupted state is left over.
    ```bash
    rm -rf .venv
    ```

3. **Re-create the virtual environment:**
    ```bash
    uv venv
    ```

4. **Activate the venv and try again:** `uv` will now be forced to perform a fresh authentication handshake with GCP.
    ```bash
    uv add my-private-package
    ```