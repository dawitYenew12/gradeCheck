import { useState } from 'react';
import UploadForm from './features/fileUpload/uploadForm';  
import useSocket from './hooks/useSocket';                 
import './App.css';

const App = () => {
  const [realTimeProgress, setRealTimeProgress] = useState(0);

  useSocket((data) => {
    setRealTimeProgress(data.progress);  
  });

  return (
    <div>
      <h1>File Upload</h1>
      <UploadForm realTimeProgress={realTimeProgress} />  
    </div>
  );
};


export default App;
