import { Box } from '@mui/material';
import Naneside from '../Message/NameSide';
import CallSide from './CallSide';
export default function Call(params) {

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'lightseagreen',
                    display: 'flex',
                    overflow: 'auto',
                }}
            >
                <Naneside name={'Call'}/>
                <CallSide/>
            </Box>
        </>
    )
}