import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Alert, IconButton, InputAdornment, Stack } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

export default function LoginAdmin() {
  const [alert, setAlert] = useState({
    show: false,
    severity: "",
    message: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage("Mila fenoina daholo!! ");
      setTimeout(() => {
        setMessage("Tous les champs sont requis! ");
      }, 2000);
      return;
    }

    try {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/administrateur/login",
          {
            email,
            password,
          }
        );
        setAlert({
          show: true,
          severity: "success",
          message: "Connexion réussie!",
        });
        setTimeout(() => {
          navigate(`/adminprofile/${response.data.admin.id}`);
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data) {
          setMessage(error.response.data.message);
          setAlert({
            show: true,
            severity: "warning",
            message: "Mauvais email ou mot de passe.",
          });
          setTimeout(() => {}, 2000);
        } else {
          setAlert({
            show: true,
            severity: "error",
            message: "Erreur de connexion!",
          });
        }
      }
    } catch (error) {
      console.error(error);
      setAlert({ show: true, severity: "error", message: "Erreur inconnue!" });
    }
  };

  useEffect(() => {
    if (alert.show && alert.severity === "error") {
      const timer = setTimeout(() => {
        setAlert({ show: false, severity: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    navigate("/forgotpass");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ width: "100%", maxWidth: "450px" }}>
        {alert.show && (
          <Stack
            sx={{
              width: "100%",
              maxWidth: "450px",
              position: "fixed",
              top: "40px",
              zIndex: 1000,
            }}
            spacing={2}
          >
            <Alert variant="filled" severity={alert.severity}>
              {alert.message}
            </Alert>
          </Stack>
        )}
        <Card
          variant="outlined"
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 4,
            zIndex: 999,
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <Typography component="h1" variant="h4" textAlign="center">
            Connexion en tant qu'administrateur
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormLabel htmlFor="password">Mot de passe</FormLabel>
                <Link
                  size="small"
                  component="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: "baseline" }}
                >
                  Mot de passe oublié ?
                </Link>
              </Box>
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
            />
            <Button size="small" type="submit" fullWidth variant="contained">
              Connexion
            </Button>
          </Box>
          <Divider>ou</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              size="small"
              type="submit"
              fullWidth
              variant="outlined"
              onClick={handleBack}
            >
              Retour
            </Button>
          </Box>
        </Card>
      </div>
    </div>
  );
}
