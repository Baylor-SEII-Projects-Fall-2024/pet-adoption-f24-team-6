import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Paper, CircularProgress, IconButton} from '@mui/material';
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


let userId;

const PetCard = ({ pet }) => (
    <Paper
        style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            marginBottom: '10px',
            width: '35%'
        }}
    >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
                src={pet.photo}
                alt={pet.name}
                style={{
                    width: '80%',
                    height: '40%',
                    objectFit: 'cover',
                    marginBottom: '10px',
                }}
            />
            <h3 style={{ margin: 0 }}>{pet.name}</h3>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <IconButton color="success" onClick={() => HandleLike(pet.id)}>
                <ThumbUpIcon />
            </IconButton>
            <IconButton color="error" onClick={() => HandleDisLike(pet.id)}>
                <ThumbDownIcon />
            </IconButton>
        </div>
    </Paper>
);

const HandleLike = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                petId: id
            }),
        });

        if(response.status === 200){
            console.log();
        }
    } catch (error) {
        console.error('Error while liking:', error.response?.data || error.message);
    }
};

const HandleDisLike = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/dislike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                petId: id
            }),
        });

        if(response.status === 200){
            console.log();
        }
    } catch (error) {
        console.error('Error while liking:', error.response?.data || error.message);
    }
};

const ForYouPage = () => {
    const [pets, setPets] = useState([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userKey, setUserKey] = useState(null);
    const startY = useRef(0);
    const scrollTimeout = useRef(null);
    const lastScrollTime = useRef(0);
    const authToken = Cookies.get('authToken');
    const router = useRouter();

    useEffect(() => {
        if( !authToken ){
            // user not logged in
            router.push('/sign-in');
            return;
        }
        const fetchPets = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/getAll`); // Fetch a batch of pets
                const data = await response.json();
                console.log(data)
                setPets(data);
            } catch (error) {
                console.error("Failed to fetch pets", error);
            }
            setLoading(false);
        };
        fetchPets();
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                const data = await response.json();

                if (!response.ok) {
                    console.error('Failed to fetch user type:', response.statusText);
                    return;
                }
                userId = data.userID
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        };

        checkAuth();
    }, [authToken, router]);

    const goToNextPet = useCallback(() => {
        if (currentPetIndex < pets.length - 1) {
            setCurrentPetIndex((prevIndex) => prevIndex + 1);
        }
    }, [currentPetIndex, pets]);

    const goToPreviousPet = useCallback(() => {
        if (currentPetIndex > 0) {
            setCurrentPetIndex((prevIndex) => prevIndex - 1);
        }
    }, [currentPetIndex]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowDown') goToNextPet();
        if (e.key === 'ArrowUp') goToPreviousPet();
    }, [goToNextPet, goToPreviousPet]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleWheel = useCallback((e) => {
        const now = new Date().getTime();

        if (now - lastScrollTime.current > 1500) {
            if (e.deltaY > 0) {
                goToNextPet();
            } else if (e.deltaY < 0) {
                goToPreviousPet();
            }
            lastScrollTime.current = now;
        }
    }, [goToNextPet, goToPreviousPet]);

    useEffect(() => {
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        if (!startY.current) return;
        const deltaY = startY.current - e.touches[0].clientY;
        if (deltaY > 50) goToNextPet();
        else if (deltaY < -50) goToPreviousPet();
        startY.current = 0;
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{
                overflow: 'hidden',
            }}
        >
            {loading ? (
                <CircularProgress
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PetCard
                        pet={pets[currentPetIndex]}
                    />
                </div>
            )}
        </div>
    );
};

export default ForYouPage;
