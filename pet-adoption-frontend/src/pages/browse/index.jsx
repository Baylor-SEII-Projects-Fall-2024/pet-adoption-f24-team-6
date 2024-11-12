import Head from "next/head";
import React, { useState, useEffect } from 'react';
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import {useRouter} from "next/router";
import Footer from "@/components/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import ThumbsUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbsDownIcon from "@mui/icons-material/ThumbDownOffAlt";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "80%",
        margin: "0 auto",
        marginTop: '20px',
        height: '80vh'
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
        height: "50%", // image takes 2/3 of box
        backgroundColor: "#ccc"
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    textContainer: {
        height: "50%", // text takes 1/3 of the box
        padding: "10px",
        textAlign: "center",
        backgroundColor: "#fff"
    }
};


export default function browse() {

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const authToken = Cookies.get("authToken")

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/getAll`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPets(data); // store the fetched pets data in state
                setLoading(false); // loading = false (once data is fetched)
            })
            .catch(error => {
                console.error('Error fetching pets:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authToken) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                    const data = await response.json();

                    if (!response.ok) {
                        console.error('Failed to fetch user type:', response.statusText);
                        return;
                    }
                    setUserID(data.userID);
                }
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        };

        checkAuth();
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

    const handleLike = async (x) => {
        if(!authToken){
            router.push('/sign-in')
        }else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userID,
                        petId: petID
                    }),
                });

                if(response.status === 200){
                    console.log();
                }
            } catch (error) {
                console.error('Error while liking:', error.response?.data || error.message);
            }
        }
    };

    const handleDislike = async (petID) => {
        if(!authToken){
            router.push('/sign-in')
        }else {
            const requestData = {
                userId: userID,
                petId: petID
            };

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/dislike`, requestData);

                if(response.status === 200){
                    console.log();
                }
            } catch (error) {
                console.error('Error while disliking:', error.response?.data || error.message);
            }
        }
    };


    return (
        <>
            <Head>
                <title>Browse | Furever Homes</title>
            </Head>

            {pets.length === 0 && (
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
                        No Pets Available
                    </Typography>
                    <Typography variant="body1">
                        Check back later to see if any new pets are available for adoption!
                    </Typography>
                </Box>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flexGrow: 1, paddingBottom: '20px' }}>
                    <div style={styles.container}>
                        {pets.map((pet, index) => {
                            if (index % 3 === 0) {
                                return (
                                    <div key={index} style={styles.row}>
                                        {pets.slice(index, index + 3).map(pet => (
                                            <div key={pet.name} style={styles.box}>

                                                <div style={styles.imageContainer} onClick={() => router.push(`/pet/${pet.id}`)}>
                                                    <img
                                                        src={pet.photo}
                                                        alt={pet.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                </div>

                                                <div style={styles.textContainer}>
                                                    <p>Breed: {pet.breed}</p>
                                                    <p>Age: {pet.age}</p>
                                                    <p>Name: {pet.name}</p>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        // sx={{ mt: 2 }}
                                                        onClick={() => handleLike(pet.id)}
                                                        startIcon={<ThumbsUpIcon />}
                                                    >
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        // sx={{ mt: 2 }}
                                                        onClick={() => handleDislike(pet.id)}
                                                        startIcon={<ThumbsDownIcon />}
                                                    >
                                                    </Button>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
            {/*<Footer />*/}
        </>
    )
}