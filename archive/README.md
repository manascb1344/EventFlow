# Archive

Historical material from the original build and QA exercises. Nothing here is part of the application build, CI, or the production deployment.

## Layout

- `selenium/` holds the browser testing exercise. The scripts, DOCX reports, screenshots and HTML reports are kept together because the scripts write to `screenshots/` and `test_reports/` relative to the current working directory. See `selenium/README.md` before running anything.
- `notes/` holds pre-fix working notes. `bloom-fixes.txt` lists early validation and rate limiting gaps. `cors-config.json` is the original localhost-only CORS sketch. `DEPLOYMENT_REQUIREMENTS.md` is the pre-fix gap register that `DOCS/deployment.md` supersedes.

These files are retained as evidence. Do not treat them as current guidance. Current documentation is in `DOCS/` and the root `README.md`.
