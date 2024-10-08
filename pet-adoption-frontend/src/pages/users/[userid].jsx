import {useRouter} from "next/router";
import {Paper} from "@mui/material";
export default function userAcct() {
    const router = useRouter();
    const { userid } = router.query;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '90vh'
        }}>
            <Paper sx={{
                width: '500px',
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }} elevation={4}>
                User Info Here
            </Paper>
        </div>
    );
}
