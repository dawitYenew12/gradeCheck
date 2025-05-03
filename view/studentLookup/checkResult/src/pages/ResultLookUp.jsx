import React, { useState } from 'react';
import axios from 'axios';
import './ResultLookup.css'; // Assuming you have the CSS in a separate file

const ResultLookup = () => {
  const [studentId, setStudentId] = useState('');
  const [grades, setGrades] = useState(null);
  const [error, setError] = useState('');

  const fetchGrades = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/grade/${studentId}`);
      if (response.data.success) {
        setGrades(response.data.grades);
        setError('');
      } else {
        setError('No grades found.');
      }
    } catch (err) {
      setError('Error fetching grades.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchGrades();
  };

  return (
    <div className="result-lookup">
      <h1>Check Your Results</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter your Student ID"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      
      {grades && (
        <div className="result-display">
          <h2>Results for {grades.studName} (Admission Number: {grades.admissionNumber})</h2>
          <ul>
            {grades.grades.map((subjectGrade) => (
              <li key={subjectGrade._id}>
                <strong>{subjectGrade.subject}:</strong> {subjectGrade.grade}
              </li>
            ))}
          </ul>
          <div>
            <strong>Dataset Hash:</strong> {grades.datasetHash}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultLookup;
