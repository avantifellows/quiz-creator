`quiz_creator_bulk_template.csv` mirrors the quiz-creator form keys for quiz sessions.

`session_creator_quiz_import_template.csv` mirrors the row shape that `SessionCreator.py` reads and later writes back to the sheet.

Key compatibility findings:

- The raw quiz-creator-key sheet is not directly consumable by `QuizSessionCreatorFromSheet`. That code expects columns like `test_name`, `program`, `cms_test_id`, `start_date`, and `start_time`, and will fail if those headers are missing.
- `sessionCreator` uses different names for several quiz-creator inputs:
  - `name` -> `test_name`
  - `group` -> `program`
  - `parentBatch` -> `parent_id`
  - `sessionType` -> `session_type`
  - `activateSignUp` -> `signup_form`
  - `isIdGeneration` -> `id_generation`
  - `isRedirection` -> `redirection`
  - `isPopupForm` -> `popup_form`
  - `signupFormId` -> `signup_form_name` in the sheet flow
  - `popupFormId` -> `popup_form_name` in the sheet flow
  - `testType` -> `test_type`
  - `testFormat` -> `test_format`
  - `testPurpose` -> `test_purpose`
  - `optionalLimit` -> `optional_limits`
  - `cmsUrl` -> `cms_test_id`
  - `sheetName` -> `sheet_name`
  - `singlePageHeaderText` -> `single_page_header_text`
  - `nextStepUrl` -> `next_step_url`
  - `nextStepText` -> `next_step_text`
  - `startDate` / `endDate` -> split into `start_date`, `start_time`, `end_date`, `end_time`
- For quiz rows, `sessionCreator` currently hardcodes Postgres `repeat_schedule.type` to `continuous` and ignores weekly scheduling. `sessionPattern` and `activeDays` from quiz-creator are therefore not preserved by the sheet flow.
- For quiz rows, `sessionCreator` currently hardcodes `is_active` to `True` when writing Postgres, so quiz-creator `isEnabled` is not preserved by the main sheet flow.
- The main `QuizSessionCreatorFromSheet` path does not store `gurukul_format_type` into Postgres meta data. I still included `gurukul_format_type` in the import template because other scripts in the same folder reference it, but the main sheet runner does not currently use it.
- For `test_type=form`, `cms_test_id` must be a Google Sheets URL and `sheet_name` should be filled. The flow auto-forces `single_page_mode` to `Yes` for forms.
- Output columns such as `test_id`, `test_session_id`, `shortened_link`, `admin_testing_link`, and `report_link` are included because `sessionCreator` writes them back to the sheet after processing.
