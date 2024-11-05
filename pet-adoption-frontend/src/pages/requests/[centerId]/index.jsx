import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";

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
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [centerId]);

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "userId", headerName: "User ID", width: 150 },
        { field: "petId", headerName: "Pet ID", width: 150 },
        { field: "adoptionCenterId", headerName: "Center ID", width: 150 },
        { field: "status", headerName: "Status", width: 150 },
    ];

    const rows = requests.map((request) => ({
        id: request.id,
        userId: request.user.id, // Assuming you have a User object
        petId: request.pet.id, // Assuming you have a Pet object
        adoptionCenterId: request.adoptionCenter.id, // Assuming you have an AdoptionCenter object
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
