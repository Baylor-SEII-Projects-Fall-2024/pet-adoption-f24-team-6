import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    Button,
    DialogTitle,
    DialogContent, TextField, DialogActions, Dialog
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkUnreadIcon from "@mui/icons-material/Markunread";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import Cookies from "js-cookie";
import DeleteIcon from '@mui/icons-material/Delete';

const AdoptionRequests = () => {
    const router = useRouter();
    const { centerId } = router.query;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [messageDialog, setMessageDialog] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [userID, setUserID] = useState(-1);
    const [currReceiverId, setCurrReceiverId] = useState(null);
    const token = Cookies.get('authToken');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json()

                if (!response.ok) {
                    console.error('Authentication failed', response.statusText);
                }
                setUserID(data?.userID)
            } catch (error) {
                console.error("Error during checkAuth", error);
            }
        };
        checkAuth()
    }, []);

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
        { field: "adoptionCenterId", headerName: "Center ID", width: 100 },
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
        {
            field: 'message',
            headerName: 'Send Message',
            width: 120,
            renderCell: (params) => (

                <IconButton
                    color='primary'
                    onClick={() => {
                        setMessageDialog(true)
                        setCurrReceiverId(params.row.id)
                    }}
                >
                    <SendIcon />
                </IconButton>

            )
        },
        {
            field: 'delete',
            headerName: 'Delete Message',
            width: 120,
            renderCell: (params) => (

                <IconButton
                    color='error'
                    onClick={() => {
                        handleDeleteRequest(params.row.id)
                    }}
                >
                    <DeleteIcon />
                </IconButton>

            )
        }
    ];

    const rows = requests.map((request) => ({
        id: request.id,
        userId: request.user.id,
        userName: request.user.firstName + ' ' + request.user.lastName,
        userEmail: request.user.emailAddress,
        petId: request.pet.id,
        adoptionCenterId: request.adoptionCenter.id,
        isRead: request.isRead,
        message: request.user.id,
        delete: request.id,
    }));

    const handleDeleteRequest = async (requestId) => {
        try{
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/adoptionRequest/delete/${requestId}`)
            if (response.status === 200) {
                console.log("Request deleted successfully!");
                window.location.reload();
            } else {
                console.error("Failed to delete request:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting request:", error);
        }
    }

    const handleSendMessage = async () => {
        const payload = {
            senderId: userID,
            receiverId: currReceiverId,
            content: messageText
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/messages/send`, payload);
            if (response.status === 200) {
                console.log("Message sent successfully!");
                setMessageDialog(false);
                setMessageText("");
            } else {
                console.error("Failed to send message:", response.statusText);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }


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

            <Dialog open={messageDialog} onClose={() => setMessageDialog(false)}>
                <DialogTitle>Send Message</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={4}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMessageDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSendMessage} color="primary">Send Message</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdoptionRequests;
