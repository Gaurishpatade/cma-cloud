import React, { useState } from 'react';

const FileVault = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    setStatus('Getting secure URL...');

    // 1. Request the Pre-signed URL from your Lambda API
    const response = await fetch('YOUR_API_GATEWAY_URL', {
      method: 'POST',
      body: JSON.stringify({ fileName: file.name })
    });
    const { uploadURL } = await response.json();

    setStatus('Uploading to Cloud...');

    // 2. Upload the file directly to S3 using the URL
    const upload = await fetch(uploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });

    if (upload.ok) {
      setStatus('Success! File is in the vault.');
    } else {
      setStatus('Upload failed.');
    }
  };

  return (
    <div className="p-8 border-2 border-dashed rounded-lg text-center">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button 
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload to Vault
      </button>
      <p className="mt-2 text-sm">{status}</p>
    </div>
  );
};

export default FileVault;