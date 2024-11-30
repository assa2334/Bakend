import {
 Box,
 List,
 ListItem,
 ListItemButton,
 Paper,
 Typography,
 Avatar,
} from '@mui/material';

export default function Naneside({name}) {
 return (
  <Box
   sx={{
    bgcolor: 'background.paper',
    width: { xs: '0%', sm: '30%', md: '20%' },
    height: '100vh',
    borderLeft: 2,
    borderColor: 'divider',
    display: 'flex',
    flexDirection: 'column',
   }}
  >
   {/* Header Section */}
   <Paper
    elevation={7}
    sx={{
     borderRadius: 0,
     padding: 2,
     width: '100%', // Adjusted to 100%
     boxSizing: 'border-box', // Ensure padding is included in width
     marginBottom: 2, // Space between header and list
    }}
   >
    <Typography
     variant="h6"
     sx={{
      color: 'text.primary',
      '&:hover': {
       color: 'primary.light',
      },
     }}
    >
     {name}
    </Typography>
   </Paper>

   {/* List Section */}
   <List
    dense
    sx={{
     width: '100%',
     bgcolor: 'background.paper',
     flexGrow: 1, // Ensure the list takes up remaining space
     overflowY: 'auto', // Enable scrolling if content overflows
     '&::-webkit-scrollbar': {
      display: 'none', // For Chrome, Safari, and Edge
     },
    }}
   >
    {/* Example List Items */}
    {[
     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ].map((item) => (
     <ListItem key={item} disablePadding>
      <ListItemButton
       sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        boxSizing: 'border-box', // Ensure padding is included in width
        marginBottom: 2, // Space between header and list // Ensure full width
        '&:hover': {
         bgcolor: 'primary.dark',
        },
       }}
      >
       <Avatar alt={`User ${item}`} src={`/static/images/avatar/${item}.jpg`} />
       <Typography variant="body1">Suabhn</Typography>
      </ListItemButton>
     </ListItem>
    ))}
   </List>
  </Box>
 );
}
