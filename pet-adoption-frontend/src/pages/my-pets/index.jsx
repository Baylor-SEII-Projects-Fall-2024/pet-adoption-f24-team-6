import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';
import { useRouter } from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';

export default function MyPets() {
    const router = useRouter();
    const [pets, setPets] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const authToken = Cookies.get('authToken');

    useEffect(() => {
        const checkAuth = async () => {
            if (!authToken) {
                router.push('/not-authorized'); // Redirect if no token.
                return;
            }

            try {
                const responseCheckAuth = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`);
                const data = await responseCheckAuth.json();

                if (!responseCheckAuth.ok || data.userType !== "ADOPTION_CENTER") {
                    router.push('/not-authorized');
                }

                const responseGetCenterID = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/getCenterID?authToken=${authToken}`);
                const centerData = await responseGetCenterID.json();

                await fetchPets(centerData.centerID);
            } catch (error) {
                console.error("Auth check failed", error);
                router.push('/not-authorized');
            }
        };

        const fetchPets = async (centerId) => {
            try {
                const petsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}:8080/api/center/${centerId}/pets`
                );
                const petsData = await petsResponse.json();

                if (!petsResponse.ok) {
                    console.error('Failed to fetch pets:', petsResponse.statusText);
                    return;
                }

                setPets(petsData);
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };

        if (pets.length === 0) {
            checkAuth();
        }
    }, [authToken, pets.length, router]);

    const handleDelete = async (petId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/delete/${petId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete pet');
            }

            setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'age', headerName: 'Age', width: 100 },
        { field: 'species', headerName: 'Species', width: 120 },
        { field: 'breed', headerName: 'Breed', width: 150 },
        { field: 'size', headerName: 'Size', width: 100 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        {
            field: 'photo',
            headerName: 'Photo',
            width: 150,
            renderCell: (params) => (
                <img src={params.value} alt={params.row.name} style={{ width: '50px', height: '50px', borderRadius: '4px' }} />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color='error'
                    onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(params.row.id)
                    }}
                >
                    Delete
                </Button>
            ),
        },
    ];

    const handleRowClick = async (params) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/${params.id}`);
        const petData = await response.json();
        setSelectedPet(petData);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPet(null);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/pet/update/${selectedPet.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedPet),
            });

            if (!response.ok) {
                throw new Error('Failed to update pet details');
            }

            setPets((prevPets) =>
                prevPets.map((pet) => (pet.id === selectedPet.id ? selectedPet : pet))
            );

            handleClose();
        } catch (error) {
            console.error('Error updating pet:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Typography variant="h4" gutterBottom>Your Pets</Typography>
            <Typography variant="subtitle1" gutterBottom>Click on a row to edit it</Typography>

            <Box sx={{ height: '80%', width: '80%' }}>
                <DataGrid
                    rows={pets}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight
                    getRowId={(row) => row.id}
                    onRowClick={handleRowClick}
                />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Pet Details</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPet?.name || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Age"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={selectedPet?.age || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, age: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Species"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPet?.species || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, species: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Breed"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPet?.breed || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, breed: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Size"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPet?.size || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, size: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Gender"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPet?.gender || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, gender: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Color"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={selectedPet?.color || ''}
                        onChange={(e) => setSelectedPet({ ...selectedPet, color: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
