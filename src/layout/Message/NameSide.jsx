import { Upload } from "@mui/icons-material";
import { Box, List, ListItem, ListItemButton, Paper, Typography, Avatar, CircularProgress } from "@mui/material";

export default function NameSide({ name, data, isPending,onUserClick,UploadStatus }) {
  


  // Handle cases where data is not yet available or empty
  if (!data || !data || data.length === 0) {
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
        {name === "Status" ? 
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
                boxSizing: "border-box", // Ensure padding is included in width
                bgcolor: "primary.dark",
                marginBottom: 2, // Space between header and list
                "&:hover": {
                  bgcolor: "text.light",
                },
              }}
              onClick={UploadStatus}
            >
              <Avatar alt="Add Status" src="https://img.icons8.com/ios/452/add.png" />
              <Typography color="text.dark" variant="body1">Add Status</Typography>
            </ListItemButton>
          </ListItem>
          
          : ""}
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
          {name === "Status" ? 
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
                boxSizing: "border-box", // Ensure padding is included in width
                marginBottom: 2, // Space between header and list
                bgcolor: "primary.dark",
                "&:hover": {
                  bgcolor: "text.light",
                },
              }}
              onClick={UploadStatus}
            >
               <Avatar alt="Add Status" src="https://img.icons8.com/ios/452/add.png" />
               <Typography color="text.dark" variant="body1">Add Status</Typography>
            </ListItemButton>
          </ListItem>
          
          : ""}
          {data.map((item,index) => ( 
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
