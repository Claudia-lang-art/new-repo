import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, TextField, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ClassForm = ({
  open,
  onClose,
  onSave,
  classItem,
  modalType,
}) => {
  const [formValues, setFormValues] = useState({
    codeClasse: '',
    libelleClasse: '',
    libelleOption: '',
  });

  useEffect(() => {
    if (classItem) {
      setFormValues({
        codeClasse: classItem.codeClasse || '',
        libelleClasse: classItem.libelleClasse || '',
        libelleOption: classItem.libelleOption || '',
      });
    } else {
      setFormValues({
        codeClasse: '',
        libelleClasse: '',
        libelleOption: '',
      });
    }
  }, [classItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/students');
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };
  

  return (
    open && (
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          position: 'relative',
          width: 600,
          maxWidth: '90%',
          mx: 'auto',
          boxShadow: 3,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'gray' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" mb={2} textAlign="center">
          {modalType === 'add' ? 'Ajouter une Classe' : 'Modifier la Classe'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Code Classe"
              fullWidth
              name="codeClasse"
              value={formValues.codeClasse}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Libellé"
              fullWidth
              name="libelleClasse"
              value={formValues.libelleClasse}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Libellé Option"
              fullWidth
              name="libelleOption"
              value={formValues.libelleOption}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="center">
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ bgcolor: "#FF69B4" }}>
            {modalType === 'add' ? 'Ajouter' : 'Modifier'}
          </Button>
        </Box>
      </Box>
    )
  );
};

export default ClassForm;
