# Google Sheets Integration for Form Questionnaires

## Overview

This implementation adds Google Sheets integration for form questionnaires in the quiz-creator application, allowing users to provide Google Sheets links instead of uploading CSV files.

## Changes Made

### 1. Type System Updates

#### `src/types/formbuilder.types.ts`

- Added `MyFileProps` interface for file input components
- Extended `Field` union type to include file inputs

#### `src/types/form.types.ts`

- Updated `quizSchema` validation logic for forms and assessments
- Added conditional validation that requires Google Sheets links for forms and CMS URLs for other types
- Added URL validation for Google Sheets (docs.google.com/spreadsheets) and CMS domains

### 2. UI Components

#### `src/app/session/[type]/Steps/Platform/Quiz.tsx`

- Updated form field labels and placeholders dynamically based on test type
- For forms: Shows "Google Sheets Link" with appropriate placeholder and helper text
- For assessments: Shows "CMS URL" with CMS-specific placeholder and helper text

### 3. Form Logic

### 3. Form Logic

- Added conditional logic for form vs assessment handling
- **Form type behavior:**
  - Shows Google Sheets Link input field
  - Automatically sets smart defaults (questionnaire format, no negative marking, Others stream, etc.)
  - Validates Google Sheets URL format
- **Assessment/Homework type behavior:**
  - Shows CMS URL text input
  - Validates CMS domain format
- Updated labels and helper text to clearly indicate when each field should be used

### 4. Testing Infrastructure

#### `cypress/mocks/mockdata.ts`

- Updated `CreateFormData` with Google Sheets link for testing
- Includes appropriate defaults for form-specific fields

#### `cypress/e2e/quiz.cy.ts`

- Updated test case for form creation with Google Sheets link
- Tests smart defaults when form type is selected
- Verifies Google Sheets link input functionality

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
3. Enter Google Sheets link in the URL field
4. Link is validated to ensure it's a valid Google Sheets URL

### For Assessment/Homework:

1. Select "Assessment" or "Homework" as test type
2. Enter CMS URL in the text field
3. URL is validated to ensure it's a valid CMS domain

## Google Sheets Format

The Google Sheets document should contain form questions with appropriate column headers. Example structure:

| question_id | question_text                  | question_type | options                      | required |
| ----------- | ------------------------------ | ------------- | ---------------------------- | -------- |
| 1           | What is your name?             | text          |                              | true     |
| 2           | What is your favorite subject? | select        | Math,Science,English,History | true     |

## Technical Implementation Details

### Validation Logic

- **Forms:** Require Google Sheets link with docs.google.com/spreadsheets domain validation
- **Assessments/Homework:** Require CMS URL with cms.peerlearning.com domain validation
- **Error Handling:** Clear validation messages for missing required fields and invalid URLs

### Modal Display

- **Forms:** Shows "Google Sheets Link" label with clickable link
- **Assessments/Homework:** Shows "CMS Link" label with clickable link
- Links are properly formatted and validated before display

## Future Enhancements

1. Add Google Sheets API integration for content validation
2. Add preview functionality for Google Sheets content
3. Add support for additional spreadsheet formats
