import {useRouter} from "next/router";
import {Button, Paper, TextField, Typography} from "@mui/material";
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
                alignItems: 'center',
                flexDirection: 'column',
                gap: '16px'
            }} elevation={4}>
                <Typography variant="h5" sx={{marginBottom: '35px', fontWeight: 'bold'}}>Edit Account Details</Typography>
                <TextField id="outlined-basic" label="First Name" variant="outlined" sx={{width: '50%'}} />
                <TextField id="outlined-basic" label="Last Name" variant="outlined" sx={{width: '50%'}} />
                <TextField id="outlined-basic" label="Email" variant="outlined" sx={{width: '50%'}} />

                <Button variant="outlined" size="large">Submit</Button>
            </Paper>
        </div>
    );
}
