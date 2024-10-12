import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [expandedRow, setExpandedRow] = useState(null); // State to manage accordion toggle

  const gradeMapping = {
    "A+": 100,
    A: 95,
    "A-": 90,
    "B+": 85,
    B: 80,
    "B-": 75,
    "C+": 70,
    C: 65,
    "C-": 60,
    "D+": 55,
    D: 50,
    "D-": 45,
    F: 0,
    "N/A": 0,
  };

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

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedStudents = [...students].sort((a, b) => {
      // Handle sorting for overall grade
      if (key === "OverallGrade") {
        const overallA = parseFloat(calculateOverallGrade(a.id));
        const overallB = parseFloat(calculateOverallGrade(b.id));

        if (isNaN(overallA)) return 1;
        if (isNaN(overallB)) return -1;
        return direction === "asc" ? overallA - overallB : overallB - overallA;
      }

      // Handle sorting for grades and other columns
      if (key in grades[a.id] || key in grades[b.id]) {
        const gradeA = grades[a.id]?.[key]?.grade || "N/A";
        const gradeB = grades[b.id]?.[key]?.grade || "N/A";

        if (gradeA < gradeB) {
          return direction === "asc" ? -1 : 1;
        }
        if (gradeA > gradeB) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      } else {
        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      }
    });

    setStudents(sortedStudents);
  };

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
      const newGrades = { ...grades };
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

  // Calculate overall grade based on numeric mapping
  const calculateOverallGrade = (studentId) => {
    const studentGrades = grades[studentId];
    if (!studentGrades) return "N/A";

    const {
      Education = { grade: "N/A" },
      ProfessionalExperience = { grade: "N/A" },
      PersonalStatement = { grade: "N/A" },
      LettersOfRecommendation = { grade: "N/A" },
    } = studentGrades;

    const gradeValues = [
      gradeMapping[Education.grade],
      gradeMapping[ProfessionalExperience.grade],
      gradeMapping[PersonalStatement.grade],
      gradeMapping[LettersOfRecommendation.grade],
    ];

    const validGrades = gradeValues.filter((grade) => grade !== undefined);
    const total = validGrades.reduce((acc, grade) => acc + grade, 0);

    return validGrades.length ? (total / validGrades.length).toFixed(2) : "N/A";
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕"; // Default sorting icon for unsorted columns
  };

  // Toggle accordion for expanded details
  const toggleRow = (studentId) => {
    if (expandedRow === studentId) {
      setExpandedRow(null); // Close if already expanded
    } else {
      setExpandedRow(studentId); // Expand the selected row
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
            <th onClick={() => handleSort("last_name")}>
              Last Name {getSortIcon("last_name")}
            </th>
            <th onClick={() => handleSort("first_name")}>
              First Name {getSortIcon("first_name")}
            </th>
            <th onClick={() => handleSort("degree")}>
              Degree {getSortIcon("degree")}
            </th>
            <th onClick={() => handleSort("institution")}>
              School {getSortIcon("institution")}
            </th>
            <th onClick={() => handleSort("Education")}>
              Education {getSortIcon("Education")}
            </th>
            <th onClick={() => handleSort("ProfessionalExperience")}>
              Professional Experience {getSortIcon("ProfessionalExperience")}
            </th>
            <th onClick={() => handleSort("PersonalStatement")}>
              Personal Statement {getSortIcon("PersonalStatement")}
            </th>
            <th onClick={() => handleSort("LettersOfRecommendation")}>
              Letters of Recommendation {getSortIcon("LettersOfRecommendation")}
            </th>
            <th onClick={() => handleSort("OverallGrade")}>
              Overall Grade {getSortIcon("OverallGrade")}
            </th>
            <th className="details-cell">Details</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <>
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
                <td>
                  {loading[student.id]?.Education ? (
                    <div className="spinner"></div>
                  ) : (
                    grades[student.id]?.Education?.grade || "N/A"
                  )}
                </td>
                <td>
                  {loading[student.id]?.ProfessionalExperience ? (
                    <div className="spinner"></div>
                  ) : (
                    grades[student.id]?.ProfessionalExperience?.grade || "N/A"
                  )}
                </td>
                <td>
                  {loading[student.id]?.PersonalStatement ? (
                    <div className="spinner"></div>
                  ) : (
                    grades[student.id]?.PersonalStatement?.grade || "N/A"
                  )}
                </td>
                <td>
                  {loading[student.id]?.LettersOfRecommendation ? (
                    <div className="spinner"></div>
                  ) : (
                    grades[student.id]?.LettersOfRecommendation?.grade || "N/A"
                  )}
                </td>
                <td>
                  {loading[student.id] ? (
                    <div className="spinner"></div>
                  ) : (
                    calculateOverallGrade(student.id)
                  )}
                </td>
                <td className="details-cell">
                  <button
                    className="details-btn"
                    onClick={() => toggleRow(student.id)}
                  >
                    {expandedRow === student.id ? "−" : "+"}
                  </button>
                </td>
              </tr>

              {expandedRow === student.id && (
                <tr className="expanded-row">
                  <td colSpan="11">
                    <div className="grade-details">
                      <h4>
                        Details for {student.first_name} {student.last_name}
                      </h4>
                      <p>
                        <strong>Education:</strong>{" "}
                        {grades[student.id]?.Education?.grade} -{" "}
                        {grades[student.id]?.Education?.comment}
                      </p>
                      <p>
                        <strong>Professional Experience:</strong>{" "}
                        {grades[student.id]?.ProfessionalExperience?.grade} -{" "}
                        {grades[student.id]?.ProfessionalExperience?.comment}
                      </p>
                      <p>
                        <strong>Personal Statement:</strong>{" "}
                        {grades[student.id]?.PersonalStatement?.grade} -{" "}
                        {grades[student.id]?.PersonalStatement?.comment}
                      </p>
                      <p>
                        <strong>Letters of Recommendation:</strong>{" "}
                        {grades[student.id]?.LettersOfRecommendation?.grade} -{" "}
                        {grades[student.id]?.LettersOfRecommendation?.comment}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </>
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
