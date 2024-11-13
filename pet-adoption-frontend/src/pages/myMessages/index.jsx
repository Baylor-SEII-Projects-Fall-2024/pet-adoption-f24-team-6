import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function MyMessages() {
    const authToken = Cookies.get('authToken');
    const [userID, setUserID] = useState(-1);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            if (!authToken) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();

                if (response.ok && data?.userID) {
                    setUserID(data.userID);
                } else {
                    console.error('Authentication failed', response.statusText);
                }
            } catch (error) {
                console.error("Error during checkAuth", error);
            }
        };

        checkAuth();
    }, [authToken]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/messages/received/${userID}`);
                setMessages(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setLoading(false);
            }
        };

        if (userID !== -1) {
            fetchMessages();
        }
    }, [userID]);

    const handleRowClick = (params) => {
        setSelectedMessage(params.row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReplyText("");
    };

    const handleReplyChange = (event) => {
        setReplyText(event.target.value);
    };

    const handleReplySubmit = async () => {
        try {
            console.log(selectedMessage)
            const payload = {
                senderId: userID,
                receiverId: selectedMessage.senderID,
                content: replyText,
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/messages/send`, payload);

            if (response.status === 200) {
                console.log("Reply sent successfully!");
                handleClose();
            } else {
                console.error("Failed to send reply:", response.statusText);
            }
        } catch (error) {
            console.error("Error sending reply:", error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'senderName', headerName: 'Sender', width: 150 },
        { field: 'senderID', headerName: 'Sender ID', width: 150 },
        { field: 'content', headerName: 'Content', width: 300 },
        { field: 'timestamp', headerName: 'Timestamp', width: 200 },
        { field: 'read', headerName: 'Read', width: 100, type: 'boolean' },
    ];

    const rows = messages.map((message) => ({
        id: message.id,
        senderName: `${message.sender.firstName} ${message.sender.lastName}`,
        content: message.content,
        timestamp: new Date(message.timestamp).toLocaleString(),
        read: message.read,
        senderID: message.sender.id
    }));

    return (
        <div style={{ height: 750, width: '100%' }}>
            <h2 style={{marginLeft: '40%'}}>Received Messages</h2>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                loading={loading}
                checkboxSelection
                onRowClick={handleRowClick}
                sx={{
                    marginLeft: '100px',
                    marginRight: '100px',
                    marginTop: '20px',
                    marginBottom: '10px'
                }}
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Message from {selectedMessage?.senderName}</DialogTitle>
                <DialogContent>
                    <p>{selectedMessage?.content}</p>
                    <TextField
                        fullWidth
                        label="Reply"
                        multiline
                        rows={4}
                        value={replyText}
                        onChange={handleReplyChange}
                        variant="outlined"
                        sx={{
                            marginTop: '10px'
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleReplySubmit} color="primary">Send Reply</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
