import Head from "next/head";
import React from "react";
import { useState } from 'react';
import {useRouter} from "next/router";

export default function signIn() {

    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault()


        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailAddress: username, password: password }),
            });

            const data = await response.text();

            if (!response.ok) {
                console.error("Login failed", data);
                alert(data.message || 'Login failed');
            } else {
                router.push('/account');
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
                    <form style={{display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto'}}>

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
                            style={{
                                padding: '10px',
                                margin: '10px 0',
                                backgroundColor: 'cornflowerblue',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                            onClick={handleSubmit}
                            >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
