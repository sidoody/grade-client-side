# Client-Side Updates

## 1. Multiple Student Selection
- Users can now select one or more students using checkboxes in the table.
- A "Select All" checkbox has been added to easily select or deselect all students.

## 2. Running Grader for Multiple Students
- A new **"Run Grader"** button has been added to send selected students' data to the backend.
- The results are dynamically displayed in the table, with separate columns for each grading category (Education, Professional Experience, Personal Statement, and Letters of Recommendation).

## 3. Table UI Updates
- The table dynamically updates each student's row with their grades after processing.
- Spinners were added for each cell while waiting for the GPT-4 responses, improving the user experience.

## 4. Error Handling
- If there's an issue with grading (e.g., GPT-4 fails to respond), an error message is displayed in the respective cell.

## Files Updated
- **`App.jsx`**:
  - Handles multiple student selection and grading.
  - Implements spinners for loading grades.
- **`App.css`**:
  - Minor tweaks for better responsiveness and improved table layout.
