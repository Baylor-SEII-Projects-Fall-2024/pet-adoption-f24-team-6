import React, { useState } from "react";
import { Alert, Button, Container, TextField, Typography, Box, Paper } from "@mui/material";
import Head from "next/head";

export default function RegisterAsAdoptionCenter() {
    const [centerName, setCenterName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/center/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: centerName,
                    address: address,
                    ownerFirstName: firstName,
                    ownerLastName: lastName,
                    ownerAddress: emailAddress,
                    password: password,
                    contactInfo: contactInfo,
                    description: description,
                }),
            });

            if (!response.ok) {
                setSuccess(false);
                setErrorMessage("Registration Failed");
            } else {
                setSuccess(true);
                setErrorMessage("");
            }
        } catch (error) {
            console.error("Error during register", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <Head>
                <title>Register | Furever Homes</title>
            </Head>

            <Container maxWidth="sm" sx={{ display: 'flex', height: '650px', alignItems: 'center', justifyContent: 'center', marginBottom: '10rem', marginTop: '10rem' }}>
                <Paper elevation={3} sx={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{ marginBottom: '1rem' }}>
                        Register as an Adoption Center
                    </Typography>

                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ mb: 2 }}>
                            Registration Successful!
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TextField
                            label="Adoption Center Name"
                            variant="outlined"
                            value={centerName}
                            onChange={(e) => setCenterName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Address"
                            variant="outlined"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        <TextField
                            label="Owner First Name"
                            variant="outlined"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Owner Last Name"
                            variant="outlined"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Owner Email Address"
                            type="email"
                            variant="outlined"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            required
                        />
                        <TextField
                            label="Contact Info (Phone or Email)"
                            variant="outlined"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />

                        <Button type="submit" variant="contained" color="primary">
                            Register
                        </Button>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
