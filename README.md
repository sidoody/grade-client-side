# Residency Application Grader

This project helps medical residency directors grade CVs for applicants based on a predefined rubric. The application consists of a **Node.js backend** and a **React.js frontend** that work together to process CVs and return grades.

## Project Summary

### Server-Side (Node.js)
- Handles file uploads using **Multer**.
- Extracts text from CV PDFs using **pdf-parse**.
- Communicates with **GPT-4** to grade CVs based on rubric (education, experience, etc.).
- REST API that accepts CVs and returns grading results.

### Client-Side (React.js)
- Provides a user interface to upload CVs and submit them for grading.
- Displays the grading results in a clean, responsive UI.
- Handles file uploads and communicates with the backend to fetch grading results.

## To-Dos
- **Multiple PDFs**: Allow the upload and processing of multiple PDFs at once, with each returning separate grades.
- **Grades in a Table**: Display grades in a table format:
  - Columns: Student name and individual grades.
  - Rows: Each student’s row can expand to show detailed information for each grade.
- **Loader**: Add a loader that shows while the PDFs are being processed and GPT is working on returning grades.

## How to Run the Project
1. Clone the repository.
2. Install dependencies for both the server and client sides.
3. Run the server-side Node.js application and the client-side React app.

## Next Steps
Stay tuned for future features, including user-adjustable grading rubrics and handling multiple applicant documents at once.
