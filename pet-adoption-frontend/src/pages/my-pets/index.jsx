import {router, useRouter} from "next/router";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from "@mui/material";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

export default function MyPets() {
    const router = useRouter();
    const [pets, setPets] = useState([]);
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
        }

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

                setPets(petsData)
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };

        if(pets.length === 0){
            checkAuth()
        }
    })

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
                <div>
                    test
                </div>
            ),
        },
    ];

    return (
        <Box sx={{ height: 400, width: '100%', mt: 2 }}>
            <DataGrid
                rows={pets}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                getRowId={(row) => row.id}
            />
        </Box>
    );
}