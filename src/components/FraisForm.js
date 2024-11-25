import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, TextField, Button, Grid, Modal, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FraisForm = ({ open, onClose, onSave, frais, modalType }) => {
  const [formData, setFormData] = useState({
    CodeFrais: '',
    libelleFrais: '',
    montantF: '',
  });

  useEffect(() => {
    if (frais) {
      setFormData({
        codeFrais: frais.CodeFrais || '',
        libelleFrais: frais.libelleFrais || '',
        montantF: frais.montantF || '',
      });
    } 
  }, [frais]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   const handleSubmit = () => {
    if (!formData.CodeFrais || !formData.libelleFrais || !formData.montantF) {
      console.error('Tous les champs doivent être remplis');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', width: '40%', mx: 'auto', mt: 3, boxShadow: 24, borderRadius: 2 }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" mb={3}>
          {modalType === 'add' ? 'Ajouter Frais' : 'Modifier Frais'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code Frais"
                name="CodeFrais"
                value={formData.CodeFrais}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
            <Select
                fullWidth
                label="Libelle"
                name="libelleFrais"
                value={formData.libelleFrais}
                onChange={handleChange}
                required>
                   <option value="Droit d'inscription">Droit d'inscription</option>
                   <option value="Droit d'examin">Droit d'examin</option>
                   <option value="Frais generaux">Frais generaux</option>
              
                </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                label="montantF"
                name="montantF"
                value={formData.montantF}
                onChange={handleChange}
                required>
                   <option value='100000'>100000</option>
                   <option value='20000'>20000</option>
                   <option value='20000'>20000</option>
                   <option value='65000'>65000</option>
                   <option value='62000'>62000</option>
                </Select>
            
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                sx={{ bgcolor: "#FF69B4", color: 'white', '&:hover': { bgcolor: '#ff4081' } }}
              >
                {modalType === 'add' ? 'Ajouter' : 'Modifier'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default FraisForm;
