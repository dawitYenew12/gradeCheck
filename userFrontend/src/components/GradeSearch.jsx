import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchGradesByAdmissionNumber = async (admissionNumber) => {
  if (!admissionNumber) return null;
  try {
    const response = await axios.get(`/stud/grade/${admissionNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

function GradeSearch() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [cachedResult, setCachedResult] = useState(null);
  const queryClient = useQueryClient();
  
  // QueryKey explicitly uses 'grades' and the admissionNumber
  const queryKey = ['grades', admissionNumber];
  
  const {
    data: gradeData,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    dataUpdatedAt,
  } = useQuery({
    queryKey,
    queryFn: () => fetchGradesByAdmissionNumber(admissionNumber),
    enabled: searchClicked && !!admissionNumber && !cachedResult,
    staleTime: 5 * 60 * 60 * 1000, // 5 hours
    cacheTime: 6 * 60 * 60 * 1000, // 6 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  // Use the data that's active - either from cache or from query
  const displayData = cachedResult || gradeData;

  
  // Helper function to get student info
  const getStudentInfo = () => {
    if (!displayData) return { name: 'N/A', admissionNumber: '' };
    
    if (displayData.success && displayData.grades) {
      return {
        name: displayData.grades.studName || 'N/A',
        admissionNumber: displayData.grades.admissionNumber || admissionNumber
      };
    } else if (displayData.data && displayData.data.studName) {
      return {
        name: displayData.data.studName || 'N/A',
        admissionNumber: displayData.data.admissionNumber || admissionNumber
      };
    } else if (displayData.studName) {
      return {
        name: displayData.studName || 'N/A',
        admissionNumber: displayData.admissionNumber || admissionNumber
      };
    }
    
    return { name: 'N/A', admissionNumber: admissionNumber };
  };
  
  const getGradesArray = () => {
    if (!displayData) return [];
    
    if (displayData.success && displayData.grades && Array.isArray(displayData.grades.grades)) {
      return displayData.grades.grades;
    } else if (displayData.data && Array.isArray(displayData.data.grades)) {
      return displayData.data.grades;
    } else if (Array.isArray(displayData.grades)) {
      return displayData.grades;
    }
    
    return [];
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!admissionNumber || admissionNumber.length !== 6) return;
    
    // Reset cached result on new search
    setCachedResult(null);
    
    // Check cache first
    const cachedData = queryClient.getQueryData(['grades', admissionNumber]);
   
    if (cachedData) {
      setCachedResult(cachedData);
      setSearchClicked(true);
    } else {
      setSearchClicked(true);
    }
  };

  const formatAdmissionNumber = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setAdmissionNumber(value);
  };

  const isValidAdmission = admissionNumber.length === 6;

  // Reset the view for a new search
  const handleClearSearch = () => {
    setAdmissionNumber('');
    setSearchClicked(false);
    setCachedResult(null);
  };
  
  // Get student info and grades for rendering
  const studentInfo = getStudentInfo();
  const gradesArray = getGradesArray();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Check Your Grades
      </h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="mb-4">
          <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Admission Number
          </label>
          <div className="flex">
            <input
              type="text"
              id="admissionNumber"
              value={admissionNumber}
              onChange={formatAdmissionNumber}
              placeholder="Enter your 6-digit admission number (e.g., AB1234)"
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={!isValidAdmission}
              className={`px-4 py-3 rounded-r-lg cursor-pointer ${
                isValidAdmission
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Your admission number is a 6-character code provided by your school.
          </p>
        </div>
      </form>

      {/* Results Section */}
      {searchClicked && (
        <div className="border-t pt-4">
          {isLoading && !cachedResult && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}

          {isError && !cachedResult && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <p className="text-red-600 font-medium">
                {error?.response?.status === 404
                  ? "No grades found for this admission number. Please check and try again."
                  : "An error occurred while fetching your grades. Please try again."}
              </p>
              <button 
                onClick={handleClearSearch}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Try Another Search
              </button>
            </div>
          )}

          {/* Show data if available */}
          {displayData && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="font-medium text-blue-800">Student Information</h3>
                <p className="text-blue-700">Name: {studentInfo.name}</p>
                <p className="text-blue-700">Admission Number: {studentInfo.admissionNumber}</p>
                

              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mt-4">Your Grades</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gradesArray.length > 0 ? (
                      gradesArray.map((grade, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {grade.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {grade.grade}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                          No grades available for this student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* <div className="flex justify-end mt-4">
                <button 
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  New Search
                </button>
              </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GradeSearch; 