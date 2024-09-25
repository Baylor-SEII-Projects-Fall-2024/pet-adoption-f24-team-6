import Head from "next/head";
import React from "react";
import { useState } from 'react';

export default function signIn() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailAddress: username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Login failed", data);
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Error during login", error);
            alert('An error occurred. Please try again.');
        }
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <Head>
                <title>Sign In | Furever Homes</title>
            </Head>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'Center', height: '50vh'}}>
                <div style={{textAlign: 'center'}}>
                    <h1>SIGN-IN</h1>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto'}}>

                        <input
                            type="email"
                            placeholder="Email"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                            onChange={(event) => setUsername(event.target.value)}
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
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}