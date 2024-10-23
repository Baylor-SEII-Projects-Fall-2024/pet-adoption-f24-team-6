import Head from "next/head";
import React, { useState } from "react";
import { Alert, Paper } from '@mui/material'; // Import Paper from MUI

export default function Register() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailAddress: emailAddress,
                    password: password,
                    userType: 'CUSTOMER',
                    firstName: firstName,
                    lastName: lastName
                }),
            });

            const data = await response.text();

            if (!response.ok) {
                setSuccess(false);
                setErrorMessage('Registration Failed');
            } else {
                setSuccess(true);
                setErrorMessage('');
            }
        } catch (error) {
            console.error("Error during register", error);
            alert('An error occurred. Please try again.');
        }
    };

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <>
            <Head>
                <title>Register | Furever Homes</title>
            </Head>

            <div style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={3} style={{ padding: '2rem', width: '400px', textAlign: 'center', marginBottom: '2rem' }}>
                    <h1>Register</h1>

                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)} style={{ marginBottom: '1rem' }}>
                            Registration Successful!
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert severity="error" onClose={() => setErrorMessage('')} style={{ marginBottom: '1rem' }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                            type="text"
                            placeholder="First Name"
                            style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                            required
                            onChange={(e) => setfirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                            required
                            onChange={(e) => setlastName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                            required
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            style={{
                                padding: '10px',
                                margin: '10px 0',
                                backgroundColor: 'cornflowerblue',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Register
                        </button>

                        <button
                            type="button"
                            onClick={() => window.location.href = '/register-ADCenter'}
                            style={{
                                padding: '10px',
                                margin: '10px 0',
                                backgroundColor: 'cornflowerblue',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Registering as an Adoption Center?
                        </button>
                    </form>
                </Paper>
            </div>
        </>
    );
}
