# Historical Selenium exercise

These scripts and reports come from a browser-testing exercise. They are not a CI suite and are not maintained. GitHub Actions runs `pnpm lint`, `pnpm typecheck` and `pnpm build` instead.

## Contents

| Item | Purpose |
| --- | --- |
| `selenium_test.py` | Original end-to-end walkthrough of the public pages |
| `selenium_core_test.py` | Event listing and detail checks |
| `selenium_comprehensive_test.py` | Sign-in, contact, responsive and performance checks |
| `selenium_test_suite.py` | HTML report runner, writes to `test_reports/` |
| `generate_docx.py`, `generate_final_docx.py`, `generate_comprehensive_docx.py`, `generate_test_report_addendum.py` | Turn captured screenshots into DOCX reports |
| `Experiment_01_*.docx` | The generated reports |
| `screenshots/` | Captured screenshots from the runs |
| `test_reports/` | Generated HTML reports and their screenshots |
| `selenium_html_report_top.png`, `test_report_full.png` | Report previews |

## Running a script

The scripts resolve `screenshots/` and `test_reports/` relative to the current working directory. Run them from this directory so output lands beside the existing captures.

```bash
cd archive/selenium
python selenium_test.py
```

They target a running app at the URL hardcoded in each script. Update that base URL before running against a different environment. Requires Selenium and a matching browser driver, which are not declared in `package.json`.
