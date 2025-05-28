
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://dogbreedbackend-c3fahebfdgefcwf8.eastus2-01.azurewebsites.net';

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  console.log(baseURL, process.env.NODE_ENV)
  const response = await fetch(`${baseURL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.url;
}