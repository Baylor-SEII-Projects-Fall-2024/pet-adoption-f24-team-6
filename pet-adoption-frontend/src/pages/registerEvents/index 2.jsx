import React, { useState } from "react";
import { useRouter } from "next/router";


const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "50%",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
    },
    input: {
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "16px"
    },
    button: {
        padding: "10px",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px"
    },
    link: {
        marginTop: "20px",
        textAlign: "center",
        textDecoration: "none",
        color: "#0070f3"
    }
};


export default function RegisterEvent() {
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [date, setDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventData = {
            description,
            address,
            date,
            imageUrl
        };


        try {
            const response = await fetch('/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });


            if (response.ok) {
                // Redirect to events page after successful submission
                router.push('/events');
            } else {
                console.error('Failed to register event:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div style={styles.container}>
            <h2>Register a New Event</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Event Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="date"
                    placeholder="Event Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="url"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>Register Event</button>
            </form>
            <a href="/events" style={styles.link}>Back to Events</a>
        </div>
    );
}
