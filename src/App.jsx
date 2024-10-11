import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState(null); // Updated to handle plain HTML-like content
  const [error, setError] = useState(null);

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a CV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the uploaded PDF file

    try {
      const response = await fetch(
        "https://a5f0e7d7-b811-4e14-afc7-337c30782d05-00-15z8j6l8be5kq.riker.replit.dev/grade-cv",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const result = await response.json();
      console.log("Raw result from server:", result); // Debugging log to check content from server
      setContent(result.content); // Set the received HTML-like content
      setError(null); // Clear any errors
    } catch (err) {
      console.error("Error during submission:", err.message); // Debugging log for errors
      setError("Failed to submit the CV. Please try again.");
      setContent(null);
    }
  };

  return (
    <div className="App">
      <h1>Grader</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload a CV (PDF): </label>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
        </div>

        <button type="submit">Submit CV</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {content && (
        <div>
          <h2>Grading Results</h2>
          {/* Render the HTML content safely */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  );
}

export default App;
