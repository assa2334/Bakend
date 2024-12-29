import React, { useState } from "react";
import { useTransition } from "react";
//umi
import { Box, Paper, TextField, Typography, Button, InputAdornment, FormControl, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
//form vild
import { useForm } from "react-hook-form";
import { Login } from '../Api'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// context
import { useContext } from "react";
import { ThemeContext } from "../context/Context-api";

export default function SignUp() {
  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPending, setPaidding] = useTransition();
  const [open, setOpen] = useState({
    value: false,
    text: '',
    type: ''
  });
  const {setuser}= useContext(ThemeContext);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const call = (data)=>{
    setPaidding(async () => {
      let respone = await Login(data);
      console.log(respone);
      if (respone.data.message) {
      setuser((prevuser)=>({
        ...prevuser,
        Name:respone.data.data.Name,
        Email:respone.data.data.Email,
        img:respone.data.data.img ||' ',
        Token:respone.data.token ,
        id:respone.data.data._id,
    }))
    
        setOpen({ value: true, text: respone.data.message, type: "success" });

      } else {
        setOpen({ value: true, text: respone.data, type: "warning" });
      }
    })
  }

  const onSubmit = (data) => {
    call(data)
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle, #00D4FF 1%, ${theme.palette.text.dark} 95%)`,
      }}
    >
      <Paper
        component="form"
        elevation={5}
        sx={{
          padding: 4,
          width: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backdropFilter: "blur(50px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" color="primary.light" sx={{ mb: 2 }}>
          Create Account
        </Typography>

        <FormControl >
          <TextField
            id="email"
            autoComplete="email"
            label="Email"
            required
            fullWidth
            variant="standard"
            sx={{ mb: 2 }}
            error={!!errors.Email}
            helperText={errors.Email?.message}
            {...register("Email", { required: "Email is required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Enter a valid email" } })}
          />
          <TextField
            id="password"
            label="Password"
            type={passwordVisible ? "text" : "password"}
            variant="standard"
            sx={{ mb: 4 }}
            autoComplete="current-password"
            required
            error={!!errors.Password}
            helperText={errors.Password?.message}
            {...register("Password", { required: "Password is required", minLength: { value: 6, message: "Minimum length is 6" } })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    edge="end"
                  >
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button sx={{mb:2}}  variant="contained" color="primary" type="submit" fullWidth>
            {isPending ? <CircularProgress color="success" /> : "Sign Up"}
          </Button>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                try {
                  const decoded = jwtDecode(credentialResponse.credential); // Decode the token
                  let data ={
                    Name:decoded.given_name,
                    FullName:decoded.family_name,
                    Email:decoded.email,
                    Password:decoded.sub,
                    img:decoded.picture,
                    email_verified:decoded.email_verified,
                  }
                  call(data)
                  console.log(decoded);
                  
                } catch (error) {
                  console.error("Error decoding token:", error.message);
                }
              } else {
                console.error("No credential received");
              }
          
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </FormControl>
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Already have an account?{" "}
          <a href="/material-ui/getting-started/templates/sign-in/">Sign in</a>
        </Typography>
      </Paper>
      <Snackbar open={open.value}  autoHideDuration={6000}  anchorOrigin={{ vertical: "top", horizontal: "center" }} onClose={(event, reason) => {if (reason === 'clickaway') {return;}setOpen(false);}} >
        <Alert
          severity={open.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {open.text}
        </Alert>
      </Snackbar>
    </Box>

  );
}
