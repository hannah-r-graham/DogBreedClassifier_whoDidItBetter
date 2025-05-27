require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const upload = multer();
app.use(cors());

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'dog-images';

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

app.get('/', (_, res) => {
  res.send("Welcome to the Dog Breed Analyzer Backend!");
})

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const blobName = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer);

    res.json({ url: blockBlobClient.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

const port = process.env.PORT || 4000;

app.listen(port, (err) => {
  if (err) console.error("Failed to start server:", err);
  console.log(`Backend listening on port ${port}`)
});