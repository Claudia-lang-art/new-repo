import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, IconButton, Typography, Grid, TextField, Button, Select, MenuItem, Alert, AlertTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StudentForm = ({ open, onClose, onSave, studentItem, modalType }) => {
  const [formValues, setFormValues] = useState({
    Matricule: '',
    Nom: '',
    Prenom: '',
    Adresse: '',
    Phone: '',
    CodeClass: '',
    Photo: null,
    CodeVague: '',
  });

  const [error, setError] = useState(''); // Message d'erreur à afficher

  useEffect(() => {
    if (modalType === 'edit' && studentItem) {
      setFormValues({
        Matricule: studentItem.Matricule || '',
        Nom: studentItem.Nom || '',
        Prenom: studentItem.Prenom || '',
        Adresse: studentItem.Adresse || '',
        Phone: studentItem.Phone || '',
        CodeClass: studentItem.CodeClass || '',
        CodeVague: studentItem.CodeVague || '',
        Photo: studentItem.Photo || null,
      });
    } else if (modalType === 'add') {
      setFormValues({
        Matricule: '',
        Nom: '',
        Prenom: '',
        Adresse: '',
        Phone: '',
        CodeClass: '',
        CodeVague: '',
        Photo: null,
      });
    }
  }, [studentItem, modalType]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Nom') {
      setFormValues({ ...formValues, [name]: value.toUpperCase() });
    } else if (name === 'Prenom') {
      setFormValues({ ...formValues, [name]: capitalizeFirstLetter(value) });
    } else if (name === 'Phone') {
      if (/^\d{0,10}$/.test(value)) {
        setFormValues({ ...formValues, [name]: value });
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handlePhotoChange = (e) => {
    setFormValues({ ...formValues, Photo: e.target.files[0] });
  };

  const checkMatriculeExists = async (Matricule) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students/${Matricule}`);
      return response.data ? true : false;
    } catch (error) {
      return false; // If no student found, return false
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs vides
    if (!formValues.Matricule || !formValues.Nom || !formValues.Prenom || !formValues.Adresse || !formValues.Phone || !formValues.CodeClass || !formValues.CodeVague) {
      setError('Tous les champs sont requis.');
      return; // Arrêter la soumission si un champ requis est vide
    }

    // Vérification du doublon de matricule (uniquement lors de l'ajout)
    if (modalType === 'add') {
      const matriculeExists = await checkMatriculeExists(formValues.Matricule);
      if (matriculeExists) {
        setError('Cet étudiant existe déjà avec ce matricule.');
        return; // Empêcher la soumission si un doublon est trouvé
      }
    }

    setError('');

    const data = {
      Matricule: formValues.Matricule,
      Nom: formValues.Nom,
      Prenom: formValues.Prenom,
      Adresse: formValues.Adresse,
      Phone: formValues.Phone,
      CodeClass: formValues.CodeClass,
      CodeVague: formValues.CodeVague,
    };

    try {
      if (modalType === 'add') {
        await axios.post('http://localhost:5000/api/students', data);
      } else {
        await axios.put(`http://localhost:5000/api/students/${formValues.Matricule}`, data);
      }
      onSave(formValues);
    } catch (error) {
      setError("Erreur lors de l’envoi des données.");
      console.error('Erreur lors de l’envoi des données:', error);
    }
  };

  const [datas, setDatas] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get('http://localhost:5000/api/vagues/vagues')
      .then(res => setDatas(res.data))
      .catch(err => console.log(err));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', width: '40%', mx: 'auto', mt: 3, boxShadow: 24, borderRadius: 2, position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        {/* Alerte d'erreur personnalisée en haut et centrée */}
        {error && (
          <Alert
            severity="error"
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              mb: 2,
            }}
          >
            <AlertTitle>Erreur</AlertTitle>
            {error}
          </Alert>
        )}

        <Typography variant="h6" mb={3} mt={error ? 5 : 0}> {/* Espace en fonction de la présence de l'alerte */}
          {modalType === 'add' ? 'Ajouter Étudiant' : 'Modifier Étudiant'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Matricule"
                name="Matricule"
                value={formValues.Matricule}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom"
                name="Nom"
                value={formValues.Nom}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="Prenom"
                value={formValues.Prenom}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="Adresse"
                value={formValues.Adresse}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="Phone"
                value={formValues.Phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                name="CodeVague"
                value={formValues.CodeVague}
                onChange={handleChange}
                required
              >
                {datas.map((vague, i) => (
                  <MenuItem key={i} value={vague.CodeVague}>{vague.CodeVague}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                name="CodeClass"
                value={formValues.CodeClass}
                onChange={handleChange}
                required
              >
                {datas.map((vague, i) => (
                  <MenuItem key={i} value={vague.CodeClass}>{vague.CodeClass}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" component="label" sx={{ bgcolor: "#FF69B4", color: 'white', '&:hover': { bgcolor: '#ff4081' } }}>
                Choisir Photo
                <input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" color="primary" sx={{ bgcolor: "#FF69B4", color: 'white', '&:hover': { bgcolor: '#ff4081' } }}>
                {modalType === 'add' ? 'Ajouter' : 'Modifier'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default StudentForm;
