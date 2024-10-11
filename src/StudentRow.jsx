import React from "react";

// Component for each individual student row
function StudentRow({ student, selected, onSelect, grades }) {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(student.id)}
        />
      </td>
      <td>{student.last_name}</td>
      <td>{student.first_name}</td>
      <td>{student.degree}</td>
      <td>{student.institution}</td>
      <td>
        {grades?.Education?.loading ? (
          <div className="spinner"></div>
        ) : (
          grades?.Education?.grade || "N/A"
        )}
      </td>
      <td>
        {grades?.ProfessionalExperience?.loading ? (
          <div className="spinner"></div>
        ) : (
          grades?.ProfessionalExperience?.grade || "N/A"
        )}
      </td>
      <td>
        {grades?.PersonalStatement?.loading ? (
          <div className="spinner"></div>
        ) : (
          grades?.PersonalStatement?.grade || "N/A"
        )}
      </td>
      <td>
        {grades?.LettersOfRecommendation?.loading ? (
          <div className="spinner"></div>
        ) : (
          grades?.LettersOfRecommendation?.grade || "N/A"
        )}
      </td>
    </tr>
  );
}

export default StudentRow;
