import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null); // Reset error state
    };

    const uploadFile = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            // Step: Upload the file directly to the backend
            const response = await axios.post('http://localhost:8080/api/pic/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess(response.data);
        } catch (err) {
            setError('Failed to upload the file.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
            {loading && <p>Uploading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default UploadFile;
