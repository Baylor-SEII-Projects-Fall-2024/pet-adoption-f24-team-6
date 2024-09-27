import Head from "next/head";
import React, {useState} from "react";
import { Alert } from '@mui/material';

export default function register() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailAddress: emailAddress, password: password, userType: 'CUSTOMER' }),
            });

            const data = await response.text();

            if (!response.ok) {
                setSuccess(false);
                setErrorMessage('Registration Failed');
            } else {
                setSuccess(true); // Set success to true on successful registration
                setErrorMessage(''); // Clear error message
            }

        } catch (error) {
            console.error("Error during register", error);
            alert('An error occurred. Please try again.');
        }

    }

    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    return (
        <>
            <Head>
                <title>Register | Furever Homes</title>
            </Head>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'Center', height: '50vh'}}>
                <div style={{textAlign: 'center'}}>
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

                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto'}}>
                        <input
                            type="name"
                            placeholder="Name"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setName(event.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setEmailAddress(event.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setPassword(event.target.value)}
                        />

                        <button

                            type={"submit"}
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
    )
}
