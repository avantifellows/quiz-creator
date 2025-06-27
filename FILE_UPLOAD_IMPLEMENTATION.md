# File Upload Implementation for Form Questionnaires

## Overview

This implementation adds file upload functionality for form questionnaires in the quiz-creator application, allowing users to upload CSV files instead of typing file paths.

## Changes Made

### 1. Type System Updates

#### `src/types/formbuilder.types.ts`

- Added `MyFileProps` interface for file input components
- Extended `Field` union type to include file inputs

#### `src/types/form.types.ts`

- Updated `quizSchema` to include optional `csvFile` field
- Made `cmsUrl` optional and added conditional validation
- Added `superRefine` validation that requires CSV file for forms and CMS URL for other types

### 2. UI Components

#### `src/components/ui/input.tsx`

- Added `ControlledFileInput` component for file uploads
- Added proper TypeScript interfaces for both input types
- File uploads are restricted to `.csv` files for forms

#### `src/components/FormBuilder.tsx`

- Added support for `file` field type in the form builder
- Updated switch statement to handle file inputs

### 3. Form Logic

#### `src/app/session/[type]/Steps/Platform/Quiz.tsx`

- Added conditional logic for form vs assessment handling
- **Form type behavior:**
  - Shows CSV file upload field
  - Automatically sets smart defaults (questionnaire format, no negative marking, etc.)
  - Clears CMS URL when switching to form
- **Assessment/Homework type behavior:**
  - Shows CMS URL text input
  - Clears CSV file when switching away from form
- Updated labels to clearly indicate when each field should be used

### 4. Testing Infrastructure

#### `cypress/support/index.ts`

- Added `customFileUpload` command for file upload testing
- Handles file creation and form submission simulation

#### `cypress/mocks/mockdata.ts`

- Added `CreateFormData` with test data for form questionnaires
- Includes appropriate defaults for form-specific fields

#### `cypress/e2e/quiz.cy.ts`

- Added comprehensive test case for form creation with file upload
- Tests smart defaults when form type is selected
- Verifies file upload functionality

#### `cypress/fixtures/form-questions.csv`

- Sample CSV file for testing file upload functionality

## User Experience

### For Form Questionnaires:

1. Select "Form" as test type
2. Smart defaults are automatically applied:
   - Test Format: "questionnaire"
   - Marking Scheme: "1, 0" (no negative marking)
   - Optional Limit: "N/A"
   - Show Answers: false
   - Show Scores: false
   - Shuffle: false
   - Stream: "Others"
3. Upload CSV file using the file input field
4. CMS URL field is available but labeled for assessments/homework

### For Assessment/Homework:

1. Select "Assessment" or "Homework" as test type
2. Enter CMS URL in the text field
3. CSV file field is available but labeled for forms only

## CSV File Format

The CSV file should contain form questions with appropriate headers. Example:

```csv
question_id,question_text,question_type,options,required
1,"What is your name?",text,,true
2,"What is your favorite subject?",select,"Math,Science,English,History",true
```

## Technical Implementation Details

### Validation Logic

- **Forms:** Require CSV file, CMS URL is optional
- **Assessments/Homework:** Require CMS URL with domain validation, CSV file is optional
- **Error Handling:** Clear validation messages for missing required fields

### File Handling

- File uploads store the filename in the form field
- Actual file processing would be handled by the backend
- Frontend validates file type (CSV only)

## Future Enhancements

1. Add file content validation
