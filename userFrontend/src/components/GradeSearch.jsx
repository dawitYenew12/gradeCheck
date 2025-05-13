import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchGradesByAdmissionNumber = async (admissionNumber) => {
  if (!admissionNumber) return null;
  console.log('Fetching data from API for admission number:', admissionNumber);
  const response = await axios.get(`/stud/grade/${admissionNumber}`);
  console.log('API Response:', JSON.stringify(response.data));
  return response.data;
};

function GradeSearch() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [currentAdmissionNumber, setCurrentAdmissionNumber] = useState('');
  const queryClient = useQueryClient();
  
  const queryKey = ['grades', currentAdmissionNumber];
  
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
    queryFn: () => fetchGradesByAdmissionNumber(currentAdmissionNumber),
    enabled: searchClicked && !!currentAdmissionNumber,
    staleTime: 5 * 60 * 60 * 1000, // 5 hours
    cacheTime: 6 * 60 * 60 * 1000, // 6 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  // Log cache status whenever data changes
  useEffect(() => {
    if (isSuccess) {
      console.log('Data retrieved successfully', { 
        fromCache: !isFetching,
        updatedAt: new Date(dataUpdatedAt).toLocaleTimeString(),
        searchCount,
        queryKey
      });
    }
  }, [isSuccess, isFetching, dataUpdatedAt, searchCount, queryKey]);
  
  // Check if data is already in cache before starting a search
  const handleSearch = (e) => {
    e.preventDefault();
    
    const cachedData = queryClient.getQueryData(['grades', admissionNumber]);
    console.log('Cache check for', admissionNumber, 'Result:', cachedData ? 'Found in cache' : 'Not in cache');
    
    setCurrentAdmissionNumber(admissionNumber);
    setSearchClicked(true);
    setSearchCount(prev => prev + 1);
  };

  const formatAdmissionNumber = (e) => {
    // Force uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().slice(0, 6);
    setAdmissionNumber(value);
  };

  const isValidAdmission = admissionNumber.length === 6;

  // Extract student data from the API response
  const studentData = gradeData?.data;

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
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={!isValidAdmission}
              className={`px-4 py-3 rounded-r-lg ${
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
          {isLoading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <p className="text-red-600 font-medium">
                {error?.response?.status === 404
                  ? "No grades found for this admission number. Please check and try again."
                  : "An error occurred while fetching your grades. Please try again."}
              </p>
            </div>
          )}

          {/* Show data if available based on the actual API response structure */}
          {studentData && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="font-medium text-blue-800">Student Information</h3>
                <p className="text-blue-700">Name: {studentData.studName}</p>
                <p className="text-blue-700">Admission Number: {studentData.admissionNumber}</p>
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
                    {studentData.grades && studentData.grades.map((grade, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {grade.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {grade.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GradeSearch; 