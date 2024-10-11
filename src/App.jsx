import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState({}); // Separate loading state
  const [error, setError] = useState(null);

  // Fetch students' data from the backend
  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(
          "https://a5f0e7d7-b811-4e14-afc7-337c30782d05-00-15z8j6l8be5kq.riker.replit.dev/fetch-students",
        );
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err.message);
        setError("Failed to fetch students.");
      }
    }
    fetchStudents();
  }, []);

  // Handle selecting or deselecting students
  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId],
    );
  };

  // Handle selecting all students
  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]); // Deselect all if all are already selected
    } else {
      setSelectedStudents(students.map((student) => student.id)); // Select all
    }
  };

  // Handle grading the selected students
  const handleGradeSelectedStudents = async () => {
    // Set loading state for all selected students
    const newLoadingState = {};
    selectedStudents.forEach((id) => {
      newLoadingState[id] = {
        Education: true,
        ProfessionalExperience: true,
        PersonalStatement: true,
        LettersOfRecommendation: true,
      };
    });
    setLoading(newLoadingState); // Set the loading state

    try {
      const response = await fetch(
        "https://a5f0e7d7-b811-4e14-afc7-337c30782d05-00-15z8j6l8be5kq.riker.replit.dev/grade-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentIds: selectedStudents, // Send the selected student IDs
          }),
        },
      );

      const result = await response.json();
      console.log("Grades received from server:", result);

      // Update grades for each student in the result
      const newGrades = { ...grades }; // Preserve existing grades
      selectedStudents.forEach((studentId) => {
        if (result[studentId]) {
          newGrades[studentId] = result[studentId];
        }
      });

      setGrades(newGrades); // Update state with new grades
      setLoading({}); // Clear loading state once grading is complete
    } catch (err) {
      console.error("Error during grading:", err.message);
      setError("Failed to grade the students.");
      setLoading({}); // Clear loading state in case of error
    }
  };

  return (
    <div className="App">
      <h1>Grader</h1>

      {error && <p className="error-message">{error}</p>}

      {/* Student Table */}
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Degree</th>
            <th>School</th>
            <th>Education</th>
            <th>Professional Experience</th>
            <th>Personal Statement</th>
            <th>Letters of Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleSelectStudent(student.id)}
                />
              </td>
              <td>{student.last_name}</td>
              <td>{student.first_name}</td>
              <td>{student.degree}</td>
              <td>{student.institution}</td>
              {/* Display grades or loading spinner */}
              <td>
                {loading[student.id]?.Education
                  ? "Loading..."
                  : grades[student.id]?.Education?.grade || "N/A"}
              </td>
              <td>
                {loading[student.id]?.ProfessionalExperience
                  ? "Loading..."
                  : grades[student.id]?.ProfessionalExperience?.grade || "N/A"}
              </td>
              <td>
                {loading[student.id]?.PersonalStatement
                  ? "Loading..."
                  : grades[student.id]?.PersonalStatement?.grade || "N/A"}
              </td>
              <td>
                {loading[student.id]?.LettersOfRecommendation
                  ? "Loading..."
                  : grades[student.id]?.LettersOfRecommendation?.grade || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Run Grader Button */}
      <button
        onClick={handleGradeSelectedStudents}
        disabled={selectedStudents.length === 0}
      >
        Run Grader
      </button>
    </div>
  );
}

export default App;
