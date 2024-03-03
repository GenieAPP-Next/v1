"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { Box, IconButton, InputAdornment, Link as MuiLink, Typography, ThemeProvider } from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from 'next/navigation';


import Link from "next/link";
import theme from "@/theme/theme";

const initialValues = {
  email: "",
  password: "",
};

function RegisterForm() {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email format"),
    password: Yup.string().required("Password is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: async (values) => {
      try {
        await validationSchema.validate(values, { abortEarly: false });
        return { values, errors: {} };
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const formErrors = error.inner.reduce((acc, cur) => {
            acc[cur.path as any] = { message: cur.message };
            return acc;
          }, {} as Record<string, any>);
          return { values, errors: formErrors };
        } else {
          console.error('An unexpected error occurred:', error);
          throw new Error('An unexpected error occurred');
        }
      }
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    setSubmitting(true);
    // Here you can perform any logic you need, like calling an API
    setTimeout(() => {
      setSubmitting(false);
      router.push("/");
    }, 2000);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="top"
        minHeight="100vh"
      >
        <Box mt={7}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => router.push('/login')}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" color="textPrimary" gutterBottom>
              Sign Up
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", maxWidth: "300px" }}>
            <TextField
              fullWidth
              label='Email'
              variant='outlined'
              margin='normal'
              size='small'
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
              {...register("email")}
              error={!!errors.email} />
            <TextField
              fullWidth
              label='Password'
              type={showPassword ? "text" : "password"}
              variant='outlined'
              margin='normal'
              size='small'
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
              {...register("password")}
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }} />
            <Button
              type='submit'
              color='primary'
              variant='contained'
              disabled={isSubmitting}
              style={{ width: "100%", borderRadius: 15, marginTop: 25, fontSize: 12 }}
            >
              {isSubmitting ? <CircularProgress /> : "Sign Up"}
            </Button>
          </form>
          <Box mt={2}>
            <Typography variant='body2' color="grey" display="flex" justifyContent="center" alignItems="center" textAlign="center">
              Already have an account? <Link href="/login"> 
              <strong> Log in.</strong></Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default RegisterForm;
