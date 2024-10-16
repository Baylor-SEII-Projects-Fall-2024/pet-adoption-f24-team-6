import Head from "next/head";
import React, { useState } from "react";
import { Alert } from '@mui/material';

export default function RegisterAsAdoptionCenter() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/center/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: address,
                    password: password,
                    name: centerName,
                    contactInfo: contactInfo,
                    description: description

                }),
            });

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

    const [centerName, setName] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    return (
        <>
            <Head>
                <title>Register | Furever Homes</title>
            </Head>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>Register</h1>

                    <h2 style={{marginTop: '20px', marginBottom: '20px'}}>Registering as an Adoption Center</h2>

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

                    <form onSubmit={handleSubmit}
                          style={{display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto'}}>
                        <input
                            type="text"
                            placeholder="Adoption Center Name"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setName(event.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setAddress(event.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Contact Info(Phone or Email)"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setContactInfo(event.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <textarea
                            placeholder="Description"
                            style={{
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                width: '100%',
                                height: '100px', // Adjust this to make the textarea taller
                                resize: 'vertical' // Allows the user to resize the textarea vertically
                            }}
                            required
                            onChange={(event) => setDescription(event.target.value)} // Assuming you're setting description state here
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
                                cursor: 'pointer'
                            }}
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}