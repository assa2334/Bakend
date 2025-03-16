import React, { useState,useRef, useEffect } from "react";
import { useTransition } from "react";
//umi
import { Box, Paper, TextField, Typography, Button, InputAdornment, FormControl, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
//form vild
import {  useForm } from "react-hook-form";
import { signUp,emailverify } from '../api/index'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";



//react-router
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";

export default function SignUp() {

  const user = JSON.parse(localStorage.getItem('user'));
  const nagivate = useNavigate();
  if (user) {
    if (user.isverify === true) {
      nagivate("/");
    }  
  }


  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPending, setPaidding] = useTransition();
  const [isPendingverify,setPaiddingverify] = useTransition();
  const [isverify, setisverify] = useState(true);
  const [open, setOpen] = useState({
    value: false,
    text: '',
    type: ''
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);



  const { register, handleSubmit, formState: { errors } } = useForm();
  const call = (data)=>{
    setPaidding(async () => {
      let respone = await signUp(data);
      console.log(respone);
      if (respone.data.message) {
        setisverify(respone.data.isverify)
        const userData = {
          Name: respone.data.data.Name,
          Email: respone.data.data.Email,
          img: respone.data.data.img || " ",
          Token: respone.data.token,
          id: respone.data.data._id,
          isverify : respone.data.isverify
        };
        // Save userData object to localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        // setOpen({ value: true, text: respone.data.message, type: "success" });
      } else {
        setOpen({ value: true, text: respone.data, type: "warning" });
      }
    })
  }

  const onSubmit = (data) => {
    call(data)
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      setPaiddingverify(async () => {
        let respone = await emailverify(otpCode);
        console.log(respone);

        if (respone.data.message =="Email Verify" ) {
          setisverify(respone.data.data.isverify)
          let localStoragedata = JSON.parse(localStorage.getItem("user"));
          const userData = {
            Name: localStoragedata.Name,
            Email: localStoragedata.Email,
            img: localStoragedata.img || " ",
            Token: localStoragedata.Token,
            id: localStoragedata.id,
            isverify : respone.data.data.isverify
          };
          // Save userData object to localStorage
          localStorage.setItem("user", JSON.stringify(userData));
          setOpen({ value: true, text: respone.data.message, type: "success" });
          // nagivate("/");
        } else {
          setOpen({ value: true, text: respone.data.message , type: "warning" });
        }
      })
      console.log("OTP Verified:", otpCode);
    } else {
      console.log("Please enter a valid OTP");
    }
  };
  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle,rgb(25, 87, 42) 10%, ${theme.palette.text.dark} 95%)`,
      }}
    >
      {isverify && (
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
            id="name"
            label="Name"
            variant="standard"
            sx={{ mb: 2 }}
            required
            autoFocus
            error={!!errors.Name}
            helperText={errors.Name?.message}
            {...register("Name", { required: "Please enter your name", maxLength: { value: 20, message: "Max length is 20" }, pattern: { value: /^[a-zA-Z\s]+$/, message: "Name can only contain letters and spaces"}  })}
          />
          <TextField
            id="fullName"
            label="Full Name"
            variant="standard"
            sx={{ mb: 2 }}
            required
            error={!!errors.FullName}
            helperText={errors.FullName?.message}
            {...register("FullName", { required: "Please enter your full name", maxLength: { value: 50, message: "Max length is 50" },pattern: { value: /^[a-zA-Z\s]+$/, message: "Name can only contain letters and spaces"}  })}
          />
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
                    img:decoded.picture
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
          Already have an account?{""}
          <Link to="/login">Login</Link>
        </Typography>
      </Paper>
      )}
 
      {!isverify  && (
         <Paper
      elevation={5}
      sx={{
        padding: 4,
        width: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
        Verify Email
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
        Enter the OTP sent to your email
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            variant="outlined"
            sx={{
              width: "40px",
              height: "50px",
              textAlign: "center",
              fontSize: "20px",
              "& input": {
                textAlign: "center",
                fontSize: "20px",
                padding: "10px",
              },
            }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 3,
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "8px",
          transition: "0.3s",
          "&:hover": { backgroundColor: "#0077ff" },
        }}
        onClick={handleVerify}
      >
        {/* Verify OTP */}
        {isPendingverify ? <CircularProgress color="success" /> : "Verify OTP"}
      </Button>
    </Paper>
      )}  
  

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
