<#
Remove tracked __pycache__ directories and .pyc files from git index.

USAGE:
1. Open PowerShell in the repository root (where .git exists).
2. Activate virtualenv if desired.
3. Run: `& .\remove_pycache.ps1`

This script will:
- Find all `__pycache__` directories and untrack them with `git rm --cached`.
- Find all tracked `*.pyc` files and untrack them.
- Stage the `.gitignore` and commit the change.

NOTE: The script will NOT automatically push; review the commit and then run `git push`.
#>

Write-Host "Starting removal of tracked __pycache__ and .pyc files..."

if (!(Test-Path -Path .git)) {
    Write-Error "This script must be run from the repository root (where .git lives)."
    exit 1
}

# Ensure .gitignore is staged if present
if (Test-Path -Path .gitignore) {
    git add .gitignore
}

# Remove tracked __pycache__ directories
$pycacheDirs = Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue
foreach ($d in $pycacheDirs) {
    Write-Host "Untracking: $($d.FullName)"
    git rm -r --cached "$($d.FullName)" 2>$null
}

# Remove tracked .pyc files
$pycFiles = git ls-files | Where-Object { $_ -like "*.pyc" }
foreach ($f in $pycFiles) {
    Write-Host "Untracking file: $f"
    git rm --cached "$f" 2>$null
}

Write-Host "Staging changes and committing..."
git add -A
git commit -m "Remove tracked __pycache__ and .pyc files; update .gitignore" || Write-Host "No changes to commit."

Write-Host "Done. Review the commit, then run 'git push' if ready."
