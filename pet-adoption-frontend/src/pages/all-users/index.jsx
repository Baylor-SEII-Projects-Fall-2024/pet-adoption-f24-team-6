import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Typography, CircularProgress } from '@mui/material';
import {useRouter} from "next/router";
import Cookies from "js-cookie";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const authToken = Cookies.get("authToken")
    const router = useRouter();

    useEffect(() => {

        const checkAuth = async () => {
            if (!authToken) {
                router.push('/not-authorized'); // Redirect if no token.
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                const data = await response.json();

                if (!response.ok || data.userType !== "ADMIN") {
                    router.push('/not-authorized');
                }
            } catch (error) {
                console.error("Auth check failed", error);
                router.push('/not-authorized');
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/getAllUsers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch users', response.statusText);
                    return;
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
        fetchUsers();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'emailAddress', headerName: 'Email Address', width: 200 },
        { field: 'userType', headerName: 'User Type', width: 120 },
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
                        <DataGrid rows={users} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
                    </div>
                )}
            </Paper>
        </div>
    );
}
