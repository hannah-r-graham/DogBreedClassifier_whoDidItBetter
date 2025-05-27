import React, { useState } from 'react';
import { uploadImage } from './azureBlobService';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(selectedFile);
        setUploadedImageUrl(imageUrl);
        alert('Image uploaded successfully!');
      } catch (error) {
        alert('Failed to upload image. Please try again.');
      }
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Welcome to the Dog Breed Analyzer</h1>
      </header>
      <main>
        <section>
          <h2>Step 1: Upload Your Dog Image</h2>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="fileInput"
            onChange={handleFileChange}
          />
          <button onClick={() => document.getElementById('fileInput').click()}>
            Select Image
          </button>
          {selectedFile && (
            <div>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Dog"
                style={{ width: '3in', height: '3in', objectFit: 'cover', marginTop: '10px' }}
              />
              <p>Selected file: {selectedFile.name}</p>
            </div>
          )}
          <div>
           <button onClick={handleUpload} style={{ marginLeft: '10px', marginTop: '10px', background:'green'}}>
            Submit
          </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
