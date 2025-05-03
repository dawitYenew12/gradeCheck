import { useState } from 'react';
import axios from 'axios';
import './UploadForm.css'; // Assuming you have the CSS in a separate file
import io from 'socket.io-client';

// eslint-disable-next-line react/prop-types
const UploadForm = ({realTimeProgress}) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const socket = io(`http://localhost:5000`); 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const gradesFile = new FormData();
    gradesFile.append('gradesFile', file);

    setUploading(true);
    setProgress(0);

    try {
      // Start the upload request
      await axios.post('http://localhost:5000/grade/upload', gradesFile);

      // Listen for progress updates from the server
      socket.on('progress', (data) => {
        setProgress(data.progress);
      });
      socket.on('failed', (data) => {
        setError(data.error);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      socket.off('progress');
    }
  };

  return (
    <div className="upload-form">
      <input type="file" onChange={handleFileChange} name="gradesFile" />
      <button onClick={handleUpload} disabled={uploading}>Upload</button>
      {uploading && (
        <div className="upload-progress">
          <div
            className="upload-progress-bar"
            style={{ width: `${progress}%` }}
          />
          <div className="upload-progress-text">{progress}%</div>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>Real-Time Progress: {realTimeProgress}%</div>
      {error && <div className='upload-failed-error'>{error}</div>}
    </div>
  );
};

export default UploadForm;
