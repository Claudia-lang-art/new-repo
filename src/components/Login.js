import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, Stack, Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useEffect } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from context
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    severity: "",
    message: "",
  });

  useEffect(() => {
    if (alert.show && alert.severity === "error") {
      const timer = setTimeout(() => {
        setAlert({ show: false, severity: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      // Supposons que l'API renvoie un token ou un statut de connexion réussi
      if (response.status === 200) {
        setAlert({
          show: true,
          severity: "success",
          message: "Connexion réussie !",
        });
        setTimeout(() => {
          navigate('/dashboard'); // Redirige vers le tableau de bord ou la page d'accueil
          login(); // Fonction de connexion depuis le contexte d'authentification
        }, 2000);
      }
    } catch (error) {
      console.error(error); // Affiche l'erreur dans la console pour le débogage
      if (error.response.data.error === 'Invalid email') {
        setEmailError('Adresse e-mail invalide !');
        setAlert({
          show: true,
          severity: "warning",
          message: "Adresse e-mail invalide.",
        });
        setTimeout(() => { }, 3000);
      } else if (error.response.data.error === 'Invalid password') {
        setPasswordError('Mot de passe incorrect');
        setAlert({
          show: true,
          severity: "warning",
          message: "Mot de passe incorrect ! ",
        });
        setTimeout(() => { }, 3000);
      } else {
        setError('Erreur de connexion');
        setAlert({
          show: true,
          severity: "error",
          message: "Erreur de connexion ! ! ",
        });
        setTimeout(() => { }, 3000);
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      {alert.show && (
        <Stack
          sx={{
            width: 450,
            height: 10,
            position: "absolute",
            textAlign: 'center',
            display: 'flex',
            mb: 70,
            p: 1
          }}
          spacing={2}
        >
          <Alert variant="filled" severity={alert.severity}>
            {alert.message}
          </Alert>
        </Stack>
      )}
      <Box
        sx={{
          width: 400,
          bgcolor: 'white',
          borderRadius: 4,
          boxShadow: 3,
          p: 4,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <img
          src="logo.jpg"
          alt="Company Logo"
          style={{ maxWidth: '250px', marginBottom: '10px' }}
        />

        <Typography variant="h6" component="h3" gutterBottom>
          IDENTIFIEZ VOUS ICI !
        </Typography>
        {/* {error && <Typography color="error">{error}</Typography>} */}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmailIcon sx={{ color: '#f48fb1' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& input': {
                  color: 'black',
                  backgroundColor: 'transparent',
                },
                '& fieldset': {
                  borderColor: '#f8bbd0',
                },
                '&:hover fieldset': {
                  borderColor: '#f48fb1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f48fb1',
                },
                '& label': {
                  color: '#f8bbd0',
                },
                '& label.Mui-focused': {
                  color: '#f48fb1',
                },
              },
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <LockIcon sx={{ color: '#f48fb1' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& input': {
                  color: 'black',
                  backgroundColor: 'transparent',
                },
                '& fieldset': {
                  borderColor: '#f8bbd0',
                },
                '&:hover fieldset': {
                  borderColor: '#f48fb1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f48fb1',
                },
                '& label': {
                  color: '#f8bbd0',
                },
                '& label.Mui-focused': {
                  color: '#f48fb1',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#f48fb1', '&:hover': { bgcolor: '#f06292' } }}
            fullWidth
          >
            SE CONNECTER
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
