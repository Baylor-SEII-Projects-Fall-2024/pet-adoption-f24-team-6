import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {Container, Typography, CircularProgress, Alert, IconButton, Button} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkUnreadIcon from "@mui/icons-material/Markunread";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AdoptionRequests = () => {
    const router = useRouter();
    const { centerId } = router.query;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (centerId) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/adoptionRequest/center/${centerId}`)
                .then((response) => {
                    setRequests(response.data);
                    console.log(response.data)
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [centerId]);

    const markAsRead = async (requestId) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/adoptionRequest/requestRead/${requestId}`);
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === requestId ? { ...request, isRead: true } : request
                )
            );
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "userId", headerName: "User ID", width: 70 },
        { field: "userName", headerName: "Name", width: 200 },
        { field: "userEmail", headerName: "Email", width: 250 },
        {
            field: "petId",
            headerName: "Pet ID",
            width: 90,
            renderCell: (params) => (
                <Button onClick={() => router.push(`/pet/${params.row.petId}`)} variant="outlined" href="#outlined-buttons" endIcon={<ArrowForwardIcon />}>
                    {params.row.petId}
                </Button>
            )
        },
        { field: "adoptionCenterId", headerName: "Center ID", width: 70 },
        {
            field: "read",
            headerName: "Read",
            width: 50,
            renderCell: (params) => (

                params.row.isRead ? (
                    <CheckCircleIcon color="success" sx={{marginTop: '10px'}} />
                ) : (
                    <IconButton
                        color="primary"
                        onClick={() => markAsRead(params.row.id)}
                    >
                        <MarkUnreadIcon />
                    </IconButton>
                )
            ),
        },
    ];

    const rows = requests.map((request) => ({
        id: request.id,
        userId: request.user.id,
        userName: request.user.firstName + ' ' + request.user.lastName,
        userEmail: request.user.emailAddress,
        petId: request.pet.id,
        adoptionCenterId: request.adoptionCenter.id,
        isRead: request.isRead,
    }));


    if (loading) {
        return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>Failed to load adoption requests.</Alert>;
    }

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 2 }}>Adoption Requests for Center ID: {centerId}</Typography>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
        </Container>
    );
};

export default AdoptionRequests;
