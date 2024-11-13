import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";


export default function myMessages() {
    const authToken = Cookies.get('authToken');
    const [userID, setUserID] = useState(-1)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${authToken}`, {
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
        if(authToken){
            checkAuth()
        }

    }, [authToken]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/messages/received/${userID}`);
                console.log(response.data)
                setMessages(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setLoading(false); // Ensure loading is stopped even on error
            }
        };

        if (userID !== -1) {
            fetchMessages();
        }
    }, [userID]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'senderName',
            headerName: 'Sender',
            width: 150,
            renderCell: (params) => {
                console.log("params", params)
                return `${params?.row?.senderName}`
            }
        },
        { field: 'content', headerName: 'Content', width: 300 },
        { field: 'timestamp', headerName: 'Timestamp', width: 200 },
        { field: 'read', headerName: 'Read', width: 100, type: 'boolean' },
    ];

    const rows = messages.map((message) => ({
        id: message?.id,
        senderName: `${message?.sender?.firstName} ${message?.sender?.lastName}`,
        content: message?.content,
        timestamp: new Date(message?.timestamp).toLocaleString(),
        read: message?.read,
    }));

    return (
        <div style={{ height: 400, width: '100%' }}>
            <h2>Received Messages</h2>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                loading={loading}
                checkboxSelection
            />
        </div>
    );

}