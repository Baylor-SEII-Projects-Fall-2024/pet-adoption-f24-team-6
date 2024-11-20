import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Typography, CircularProgress } from '@mui/material';
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {Button} from '@mui/material'
import axios from 'axios';

export default function ViewInteractions() {
    const [interactions, setInteractions] = useState([]);
    const [userID, setUserID] = useState([]);
    const [loading, setLoading] = useState(true);
    const authToken = Cookies.get("authToken")
    const router = useRouter();

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

        const fetchInteractions = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/interaction/user/${userID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch interactions', response.statusText);
                    return;
                }

                const data = await response.json();
                setInteractions(data);
            } catch (error) {
                console.error('Error fetching interactions', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
        fetchInteractions();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'species', headerName: 'Species', width: 150 },
        { field: 'breed', headerName: 'Breed', width: 200 },
        { field: 'age', headerName: 'Age', width: 120 },
        { field: 'age', headerName: 'Age', width: 120 },
    ];

    return (
        <div style={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '150px', marginBottom: '50px' }}>
            <Paper elevation={3} sx={{ padding: '20px', width: '80%', height: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                    All Users
                </Typography>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={interactions} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
                    </div>
                )}
            </Paper>
        </div>
    );
}
