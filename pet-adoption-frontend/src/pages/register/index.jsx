import Head from "next/head";
import React from "react";


export default function register() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add the functionality of signing in
        console.log("Form Submitted")
    }

    return (
        <>
            <Head>
                <title>Register | Furever Homes</title>
            </Head>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'Center', height: '50vh'}}>
                <div style={{textAlign: 'center'}}>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto'}}>
                        <input
                            type="name"
                            placeholder="Name"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={{padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
                            required
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