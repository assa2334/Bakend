import { Box, List, ListItem, ListItemButton, Paper, Typography, Avatar, CircularProgress } from "@mui/material";

export default function NameSide({ name, data, isPending,onUserClick }) {
  


  // Handle cases where data is not yet available or empty
  if (!data || !data.data || data.data.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          width: { xs: "0%", sm: "30%", md: "20%" },
          height: "100vh",
          borderLeft: 2,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={7}
          sx={{
            borderRadius: 0,
            padding: 2,
            width: "100%", // Adjusted to 100%
            boxSizing: "border-box", // Ensure padding is included in width
            marginBottom: 2, // Space between header and list
          }}
        >
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            {name}
          </Typography>
        </Paper>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="body1">No data available</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        width: { xs: "0%", sm: "30%", md: "20%" },
        height: "100vh",
        borderLeft: 2,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={7}
        sx={{
          borderRadius: 0,
          padding: 2,
          width: "100%",
          boxSizing: "border-box",
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            "&:hover": {
              color: "primary.light",
            },
          }}
        >
          {name}
        </Typography>
      </Paper>

      {/* Loading Indicator */}
      {isPending ? (
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <List
          dense
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            overflowY: "auto", 
            "&::-webkit-scrollbar": {
              display: "none", 
            },
          }}
        >
          {/* List Items */}
          {data.data.map((item,index) => ( 
            <ListItem key={index} disablePadding   >
              <ListItemButton
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                  boxSizing: "border-box", // Ensure padding is included in width
                  marginBottom: 2, // Space between header and list
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
                onClick={() => onUserClick(item)} 
              >
                <Avatar alt={`${item.Name}`} src={`${item.img}`} />
                <Typography variant="body1">{item.Name}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
