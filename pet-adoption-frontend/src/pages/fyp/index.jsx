import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Paper, CircularProgress, IconButton} from '@mui/material';
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


let userId;

const PetCard = ({ pet, router, userId }) => (
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
                src={pet?.photo}
                alt={pet?.name}
                style={{
                    width: '80%',
                    height: '40%',
                    objectFit: 'cover',
                    marginBottom: '10px',
                }}
                onClick={() => router.push(`/pet/${pet?.id}`)}
            />
            <h3 style={{ margin: 0 }}>{pet?.name}</h3>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <IconButton color="success" onClick={() => HandleLike(pet?.id, userId)}>
                <ThumbUpIcon />
            </IconButton>
            <IconButton color="error" onClick={() => HandleDisLike(pet?.id, userId)}>
                <ThumbDownIcon />
            </IconButton>
        </div>
    </Paper>
);

const HandleLike = async (id, userId) => {
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

    } catch (error) {
        console.error('Error while liking:', error.response?.data || error.message);
    }
};

const HandleDisLike = async (id, userId) => {
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
    } catch (error) {
        console.error('Error while liking:', error.response?.data || error.message);
    }
};

const ForYouPage = () => {
    const [pets, setPets] = useState([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const startY = useRef(0);
    const scrollTimeout = useRef(null);
    const lastScrollTime = useRef(0);
    const authToken = Cookies.get('authToken');
    const [viewCount, setViewCount] = useState(0);
    const router = useRouter();
    const [userId, setUserId] = useState(-1);


    useEffect(() => {
        if( !authToken ){
            // user not logged in
            router.push('/sign-in');
            return;
        }
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                const data = await response.json();

                if (!response.ok) {
                    console.error('Failed to fetch user type:', response.statusText);
                    return;
                }
                setUserId(data.userID)
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        };

        checkAuth();
    }, [authToken, router]);

    useEffect(() => {
        if(userId !== -1){
            fetchPets()
        }
    }, [userId])

    const fetchPets = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/user/${userId}`);
            const data = await response.json();
            setPets((prevPets) => [...prevPets, ...data]);
        } catch (error) {
            console.error("Failed to fetch pets:", error);
        } finally {
            setLoading(false);
        }
    };

    const goToNextPet = useCallback(() => {
        if (currentPetIndex < pets.length - 1) {
            setCurrentPetIndex((prevIndex) => prevIndex + 1);
            setViewCount((prevCount) => prevCount + 1);

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

    useEffect(() => {
        if (viewCount === 3) {
            fetchPets();
            setViewCount(0); // Reset the count after fetching new pets
        }
    }, [viewCount]);

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
                        router={router}
                        userId={userId}
                    />
                </div>
            )}
        </div>
    );
};

export default ForYouPage;
