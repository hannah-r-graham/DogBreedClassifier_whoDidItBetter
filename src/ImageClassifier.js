async function classifyImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://dogbreedbackend-c3fahebfdgefcwf8.eastus2-01.azurewebsites.net/classify', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  displayResults(result.predictions);
}

function displayResults(predictions) {
  // Update the UI with the classification results
  const resultElement = document.getElementById('results');
  resultElement.innerHTML = `Predicted Breed: ${predictions}`;
}

export { classifyImage, displayResults };
