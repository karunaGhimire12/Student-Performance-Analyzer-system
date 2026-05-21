Steps I prepared to remove tracked Python cache files from the repository

1) I added a PowerShell helper script `remove_pycache.ps1` at the project root. It:
   - Finds all `__pycache__` directories and runs `git rm -r --cached` on them.
   - Finds tracked `*.pyc` files and runs `git rm --cached` on them.
   - Stages changes and commits a message: "Remove tracked __pycache__ and .pyc files; update .gitignore".

2) I verified your `.gitignore` already contains entries to ignore `__pycache__/` and `*.pyc`.

What you need to do locally (PowerShell):

1. Open PowerShell in the repository root where `.git` is located.
2. Optionally activate your virtual environment:
   & ".\venv\Scripts\Activate.ps1"
3. Run the helper script:
   & ".\remove_pycache.ps1"
4. Inspect `git status` and the created commit.
5. Push the commit to remote:
   git push

If you prefer I can instead provide a Git Bash / WSL script — tell me which shell you use.
