# Push to GitHub

## Context
The repo currently only has a Figma Make internal remote (`api.figma.com/git/make/...`). The user wants all current code pushed to their GitHub repo: `https://github.com/Mr-Wick2005/CB_react.git`.

## Plan

1. Add GitHub repo as a second remote named `github`:
   ```
   git remote add github https://github.com/Mr-Wick2005/CB_react.git
   ```

2. Push the `main` branch to it:
   ```
   git push github main --force
   ```
   (`--force` because the GitHub repo may have an unrelated initial commit)

## Verification
`git push` exits 0 and the GitHub repo shows all source files.
