

import { useEffect, useState } from "react"
import { useTheme } from "@mui/material/styles"
import { UserListforadmin } from "../../api/index"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Tooltip,
  Typography,
  Box,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material"

// Sample data - replace with your actual data fetching logic


export default function Admin() {
  const theme = useTheme()

  const [openLocationDialog, setOpenLocationDialog] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)


  const [users, setUsers] = useState([])
  useEffect(() => {
    async function User() {
      let response = await UserListforadmin();
      console.log(response.data.users, "hello");

      setUsers(response?.data.users);
    }
    User()
  }, [])



  const handleLocationClick = (location, user) => {
    setSelectedLocation(location)
    setSelectedUser(user)
    setOpenLocationDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenLocationDialog(false)
  }

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log("Edit user with ID:", id)
  }

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log("Delete user with ID:", id)
    setUsers(users?.filter((user) => user.id !== id))
  }

  return (
    <>
      {!users && (
        <Box
          sx={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          {/* Animated Circle */}
          <Box
            sx={{
              width: 50,
              height: 50,
              backgroundColor: "#3498db",
              borderRadius: "50%",
              animation: "pulse 1.5s infinite ease-in-out",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 1 },
                "50%": { transform: "scale(1.2)", opacity: 0.5 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          />
        </Box>
      )}

      {users && (
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: "100vh",
          }}
        >

          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderBottom: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "16px 24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                  Admin Dashboard
                </Typography>

              </Box>
            </Box>
          </Box>


          <Box
            sx={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "32px 24px",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            >
              <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: { md: "space-between" },
                    alignItems: { md: "center" },
                    gap: "16px",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                      User Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Manage all your users and their information
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: "12px",
                    }}
                  >
                    <TextField
                      placeholder="Search users..."
                      size="small"
                      sx={{
                        minWidth: "240px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      Filters
                    </Button>
                  </Box>
                </Box>
              </Box>

              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="user data table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>User</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>
                        Password
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>OTP</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>
                        Location
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 2, color: theme.palette.text.secondary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>


                    {users?.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:hover": { backgroundColor: theme.palette.action.hover },
                          transition: "background-color 0.2s",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={user.avatar}
                              alt={user.name}
                              sx={{
                                width: 40,
                                height: 40,
                                mr: 2,
                                border: `2px solid ${theme.palette.divider}`,
                              }}
                            />
                            <Box>
                              <Typography fontWeight="medium" sx={{ color: theme.palette.text.primary }}>
                                {user.Name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {user.FullName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography sx={{ color: theme.palette.primary.main }}>{user.Email}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 1, color: theme.palette.text.primary }}>{user.Password}</Typography>

                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={user.otp}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.primary.main + "20", // 20% opacity
                              color: theme.palette.primary.main,
                              fontWeight: "medium",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography sx={{ color: theme.palette.text.primary }}>{user.date}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={user.online == "active" ? "active" : "deactive"}
                            size="small"
                            sx={{
                              color: user.online == "active"
                                ? "#16a34a" // Green color if active
                                : "#dc2626", // Red color if deactive
                              fontWeight: "medium",
                         
                              "&::before": {
                                content: '""',
                                display: "inline-block",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: user.online == "active"
                                  ? "#22c55e" // Green dot if active
                                  : "#ef4444", // Red dot if deactive
                                marginRight: "6px",
                              },
                            }}
                          />
                       
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<LocationIcon />}
                            onClick={() => handleLocationClick(user.location, user)}
                            sx={{
                              borderRadius: "6px",
                              textTransform: "none",
                              borderColor: theme.palette.divider,
                              color: theme.palette.text.secondary,
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Edit User">
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.primary.main + "20", // 20% opacity
                                  color: theme.palette.primary.main,
                                  "&:hover": { backgroundColor: theme.palette.primary.main + "30" }, // 30% opacity
                                }}
                                onClick={() => handleEdit(user.id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                // sx={{
                                //   backgroundColor: isDarkMode ? "#450a0a" : "#fef2f2",
                                //   color: isDarkMode ? "#f87171" : "#dc2626",
                                //   "&:hover": { backgroundColor: isDarkMode ? "#7f1d1d" : "#fee2e2" },
                                // }}
                                onClick={() => handleDelete(user.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More Options">
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.action.hover,
                                  color: theme.palette.text.secondary,
                                  "&:hover": { backgroundColor: theme.palette.action.selected },
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  p: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Showing {users.length} of {users.length} users
                </Typography>
                <Box sx={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="outlined"
                    disabled
                    sx={{
                      borderRadius: "6px",
                      minWidth: "40px",
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "6px",
                      minWidth: "40px",
                    }}
                  >
                    1
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "6px",
                      minWidth: "40px",
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>


          <Dialog
            open={openLocationDialog}
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                maxWidth: "500px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            <DialogTitle sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                User Location
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              {selectedUser && (
                <Box>
                  <Box sx={{ p: 3, display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      sx={{
                        width: 56,
                        height: 56,
                        mr: 2,
                        border: `2px solid ${theme.palette.divider}`,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                        {selectedUser.fullName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {selectedUser.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      LOCATION DETAILS
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: theme.palette.action.hover,
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 3,
                      }}
                    >
                      <LocationIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: "medium" }}>
                        {selectedLocation}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: theme.palette.action.hover,
                        p: 2,
                        borderRadius: "8px",
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                        ADDITIONAL INFORMATION
                      </Typography>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "12px",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            Time Zone
                          </Typography>
                          <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: "medium" }}>
                            GMT-5
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            Last Check-in
                          </Typography>
                          <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: "medium" }}>
                            Today, 2:30 PM
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            Coordinates
                          </Typography>
                          <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: "medium" }}>
                            40.7128° N, 74.0060° W
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            IP Address
                          </Typography>
                          <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: "medium" }}>
                            192.168.1.1
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                View Full Details
              </Button>
            </DialogActions>
          </Dialog>


        </Box>
      )}
    </>
  )
}

