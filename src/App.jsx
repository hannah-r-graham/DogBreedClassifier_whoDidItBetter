import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [cnnResults, setCnnResults] = useState([]);
  const [openAiResult, setOpenAiResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedFile, setSubmittedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log('Selected file:', file);
  };

  const formatText = (text) => {
    return text
      .split('_') // Split by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join with spaces
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setLoading(true)
      setSubmittedFile(selectedFile);

      try {
        // Step 1: Upload the image
        const uploadResponse = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        setUploadedImageUrl(uploadData.url);

        // Step 2: Classify the image using CNN
        const classifyResponse = await fetch('http://localhost:4000/classify', {
          method: 'POST',
          body: formData,
        });

        if (!classifyResponse.ok) {
          throw new Error('Failed to classify image');
        }

        const classifyData = await classifyResponse.json();
        setCnnResults(classifyData.sortedPredictions);

        // Step 3: Analyze the image using OpenAI
        const analyzeResponse = await fetch('http://localhost:4000/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!analyzeResponse.ok) {
          throw new Error('Failed to analyze image');
        }

        const analyzeData = await analyzeResponse.json();
        setOpenAiResult(analyzeData.OpenAIbreed);

        // Set success message
        setSuccessMessage('Image processed successfully! Woof!');
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Find out what AI thinks your dog is</h1>
      </header>
      <main>
        {/* <p>{selectedFile?.name}</p>
        <p>{submittedFile?.name}</p> */}
        <section>
          <h2>Upload Your Dog Image:</h2>
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
            </div>
          )}
          <div>
            <button
              onClick={handleSubmit}
              className='submit-button'
              style={{
                marginLeft: '10px',
                marginTop: '10px',
                // background: selectedFile ? 'green' : 'grey',
              }}
              disabled={!selectedFile || selectedFile?.name === submittedFile?.name}
            >
              Submit
            </button>
          </div>
        </section>
        {successMessage && (
          <section>
            <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>
          </section>
        )}
        {loading && (
          <p>Loading...</p>
        )}
        {cnnResults.length > 0 && openAiResult && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h3>CNN Prediction</h3>
                {cnnResults.map((result, index) => (
                  <p key={index}>
                    {formatText(result.breed)}, <em>Confidence: {(result.confidence * 100).toFixed(2)}%</em>
                  </p>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <h3>GPT4o Prediction</h3>
                {openAiResult.split(/[0-9]+\.\s/).filter(Boolean).map((prediction, index) => {
                  // Split the prediction into breed and confidence
                  const [breed, confidence] = prediction.split(',').map(part => part.trim());
                  return (
                    <p key={index}>
                      {formatText(breed)}, <em>Confidence: {confidence}</em>
                    </p>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;