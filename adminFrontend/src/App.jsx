import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'

function App() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null) // 'success' or 'error'
  const [message, setMessage] = useState('') // The message to display

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setStatus(null)
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setStatus('error')
      setMessage('Please select an Excel file')
      return
    }

    const formData = new FormData()
    formData.append('gradesFile', file)

    try {
      setUploading(true)
      setStatus(null)
      setMessage('')
      
      const response = await axios.post('/admin/grade/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setStatus('success')
      setMessage('File uploaded successfully!')
    } catch (err) {
      console.error('Upload error:', err)
      
      setStatus('error')
      
      if (err.response) {
        if (err.response.status === 400) {
          if (err.response.data.message && 
             (err.response.data.message.includes('duplicate') || 
              err.response.data.message.includes('already been uploaded'))) {
            setMessage('This Excel file has already been uploaded. Duplicate files are not allowed.')
          } else {
            setMessage(err.response.data.message || 'Error uploading file. Please try again.')
          }
        } else {
          setMessage(err.response.data.message || 'Error uploading file. Please try again.')
        }
      } else {
        setMessage('Network error. Please check your connection and try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Dashboard - Grade Upload
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="gradesFile"
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <label
                htmlFor="gradesFile"
                className="block cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="mx-auto h-16 w-16 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div className="text-gray-600">
                    {file ? (
                      <p>{file.name}</p>
                    ) : (
                      <p>Drag and drop your Excel file here or click to browse</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Only Excel files (.xlsx, .xls) are supported
                  </div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className={`w-full cursor-pointer py-3 px-4 rounded-md text-white font-medium${
                uploading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : 'Upload Excel File'}
            </button>
          </form>

          {status === 'error' && message && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-center">
              <p className="text-red-600 font-medium">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-center">
              <p className="text-green-600 font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
