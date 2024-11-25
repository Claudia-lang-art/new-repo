import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  Grid,
  Link,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Backup } from "@mui/icons-material";
import SidebarDrawer from "../MiniDrawer";

function Commune() {
  const [data, setData] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({
    id: "",
    codecommune: "",
    nomcommune: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let timer;
    if (alert.open) {
      timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, open: false }));
      }, 2000); // 2000 ms = 2 seconds
    }
    return () => clearTimeout(timer);
  }, [alert.open]);

  const getData = () => {
    axios
      .get("http://localhost:4000/api/commune")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/api/delete/commune/${id}`)
      .then(() => {
        setAlert({
          open: true,
          message: "Commune supprimée avec succès!",
          severity: "success",
        });
        getData();
        handleCloseDialog();
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: "Erreur lors de la suppression de la commune.",
          severity: "error",
        });
        console.log(err);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      getData();
    } else {
      axios
        .get(`http://localhost:4000/api/recherche/commune/${searchTerm}`)
        .then((res) => setData(res.data))
        .catch((err) => console.log(err));
    }
  };

  const handleOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:4000/api/commune", values)
      .then((res) => {
        if (res.data.Status === "doublon") {
          setAlert({
            open: true,
            message: "Cette enregistrement existe deja !.",
            severity: "error",
          });
        } else {
          setAlert({
            open: true,
            message: "Commune ajoutée avec succès!",
            severity: "success",
          });
          setValues({ id: "", codecommune: "", nomcommune: "" });
          setIsEditing(false);
          setSelectedCommune(null);
          getData();
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: "Erreur lors de l'ajout de la commune.",
          severity: "error",
        });
        console.log(err);
      });
  };

  const handleUpdate = () => {
    if (values.id) {
      axios
        .put(`http://localhost:4000/api/edit/commune/${values.id}`, values)
        .then(() => {
          setAlert({
            open: true,
            message: "Commune modifiée avec succès!",
            severity: "success",
          });
          setValues({ id: "", codecommune: "", nomcommune: "" });
          setIsEditing(false);
          setSelectedCommune(null);
          getData();
        })
        .catch((err) => {
          setAlert({
            open: true,
            message: "Erreur lors de la modification de la commune.",
            severity: "error",
          });
          console.log(err);
        });
    } else setAlert("Erreur : ID manquant pour la modification", "error");
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f5f5f5",
        width: "100%",
        height: "100vh",
      }}
    >
      <SidebarDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: "60px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, width: "100%" }}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" color="textPrimary">
                    Administration
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Typography
                      variant="body2"
                      component={Link}
                      to="/Dashboard"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      /
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Admin
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {isEditing ? "Modifier Commune" : "Ajouter Commune"}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Code Commune"
                    variant="outlined"
                    name="codecommune"
                    value={values.codecommune}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Commune"
                    variant="outlined"
                    name="nomcommune"
                    value={values.nomcommune}
                    onChange={handleChange}
                    required
                  />
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => {
                        setIsEditing(false);
                        setValues({ id: "", codecommune: "", nomcommune: "" });
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      {isEditing ? "Modifier" : "Valider"}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>

            {/* Alert Component */}
            {alert.open && (
              <Alert
                variant="filled"
                severity={alert.severity}
                onClose={handleCloseAlert}
                sx={{ width: "100%", mt: 2 }}
              >
                {alert.message}
              </Alert>
            )}
          </Grid>

          {/* Tableau Section */}
          <Grid
            elevation={3}
            item
            xs={12}
            md={8}
            sx={{ maxHeight: "570px", overflowY: "hidden" }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Liste des Communes
                </Typography>
                <form
                  onSubmit={handleSearch}
                  style={{ display: "flex", flex: 1 }}
                >
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Recherche"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    type="submit"
                    sx={{ ml: 1 }}
                  >
                    <i className="bi bi-search"></i>
                  </Button>
                </form>
                <TableContainer
                  sx={{ maxHeight: "450px", overflowY: "auto", mt: 2 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Identifiant</TableCell>
                        <TableCell>Code Commune</TableCell>
                        <TableCell>Commune</TableCell>
                        <TableCell className="text-center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((commune) => (
                        <TableRow key={commune.id}>
                          <TableCell>{commune.id}</TableCell>
                          <TableCell>{commune.codecommune}</TableCell>
                          <TableCell>{commune.nomcommune}</TableCell>
                          <TableCell className="text-center">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setValues({
                                  id: commune.id,
                                  codecommune: commune.codecommune,
                                  nomcommune: commune.nomcommune,
                                });
                                setIsEditing(true);
                                setSelectedCommune(commune);
                              }}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDialog(commune.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cet enregistrement ?
          </DialogContent>
          <DialogActions>
            <Button
              size="small"
              variant="outlined"
              onClick={handleCloseDialog}
              startIcon={<Backup />}
            >
              Annuler
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDelete(deleteId)}
              startIcon={<DeleteIcon />}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Commune;
