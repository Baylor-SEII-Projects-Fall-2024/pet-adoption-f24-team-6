import React, { useState } from "react";
import { Alert, Button, Container, TextField, Typography, Paper } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

export default function RegisterEvent() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [date, setDate] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);
    const router = useRouter();
    //const [photoUrl, setPhotoUrl] = useState('');
    let photoUrl = '';
    const authToken = Cookies.get('authToken');

    const getCenterId = async (e) => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/getCenterID?authToken=${authToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setSuccess(false);
                setErrorMessage('Registration Failed');
            } else {
                return data?.centerID
            }
        } catch (error) {
            console.error("Error during register", error);
            alert('An error occurred. Please try again.');
        }
    };

    const uploadFile = async () => {
        if (!file) {
            return;
        }

        const centerID = await getCenterId();
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pic/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                photoUrl = response.data;
                //setPhotoUrl(response.data);
                console.log('Uploaded photo URL:', response.data);
            }


            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/events/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        address: address,
                        date: date,
                        photo: photoUrl,
                        centerId: centerID,
                    }),
                });

                if (response.ok) {
                    setSuccess(true);
                    setErrorMessage("");
                    router.push('/events');
                } else {
                    setSuccess(false);
                    setErrorMessage("Failed to register the event");
                }
            } catch (error) {
                console.error("Error during event registration", error);
                setErrorMessage("An error occurred. Please try again.");
            }
        } catch (err){
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await uploadFile()

    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <>
            <Head>
                <title>Register Event</title>
            </Head>

            <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Paper elevation={3} sx={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{ marginBottom: '1rem' }}>
                        Register a New Event
                    </Typography>

                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ mb: 2 }}>
                            Event Registered Successfully!
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TextField
                            label="Event Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Event Description"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <TextField
                            label="Event Address"
                            variant="outlined"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        <TextField
                            label="Event Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        {/*<TextField*/}
                        {/*    label="Image URL"*/}
                        {/*    type="url"*/}
                        {/*    variant="outlined"*/}
                        {/*    value={photo}*/}
                        {/*    onChange={(e) => setPhoto(e.target.value)}*/}
                        {/*    required*/}
                        {/*/>*/}
                        <Typography gutterBottom>Upload Photo</Typography>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {/*{loading && <Typography>Uploading...</Typography>}*/}

                        <Button type="submit" variant="contained" color="primary">
                            Register Event
                        </Button>
                    </form>
                </Paper>
            </Container>
        </>
    );
}

