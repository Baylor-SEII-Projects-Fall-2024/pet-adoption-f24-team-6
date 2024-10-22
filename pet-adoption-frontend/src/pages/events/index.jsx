import Head from "next/head";
import React, { useState, useEffect } from "react";
import {Box, CircularProgress, Link, Typography} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "80%",
        margin: "0 auto"
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px"
    },
    box: {
        backgroundColor: "#f0f0f0",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "300px", // height of box, adjust if needed
        width: "30%" // Take up 1/3 of the row, so that here is 3 per row
    },
    imageContainer: {
        height: "66.66%", // image takes 2/3 of box
        backgroundColor: "#ccc"
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    textContainer: {
        height: "33.33%", // text takes 1/3 of the box
        padding: "10px",
        textAlign: "center",
        backgroundColor: "#fff"
    }
};

export default function events() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/events`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setEvents(data); // store the fetched events in data
                setLoading(false); // loading = false (once data is fetched)
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}
            >
                <CircularProgress size={80} />
            </Box>
        );
    }

    return (
        <>
            <Head>
                <title>Browse | Baylor Furries</title>
            </Head>

            {events.length === 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                        textAlign: "center",
                        gap: 2,
                    }}
                >
                    <PetsIcon sx={{ fontSize: 80, color: "#757575" }} />
                    <Typography variant="h5" component="h2">
                        No events were found
                    </Typography>
                    <Typography variant="body1">
                        Check back later to see if any events are available to find your next friend!
                    </Typography>
                </Box>
            )}

            <div style={styles.container}>
                {events.map((event, index) => {
                    if (index % 3 === 0) {
                        return (
                            <div key={index} style={styles.row}>
                                {events.slice(index, index + 3).map(event => (
                                    <div key={event.description} style={styles.box}>
                                        <Link style={styles.imageContainer} href="events/what">
                                            <img
                                                src={event.photo}
                                                alt={event.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '10px',
                                                    left: '10px',
                                                    color: 'white',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    padding: '5px 10px',
                                                    borderRadius: '5px',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                            {event.description}
                                            </span>

                                        </Link>

                                        <div style={styles.textContainer}>
                                            <p>{event.name}</p>
                                            <p>Location: {event.address}</p>
                                            <p>Date: {event.date}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </>
    )

}