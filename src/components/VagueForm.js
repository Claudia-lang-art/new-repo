import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton, Typography, Grid, TextField, Button, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const VagueForm = ({ open, onClose, onSave, vague, modalType }) => {
  const [formData, setFormData] = useState({
    CodeVague: '',
    libelleVague: '',
    CodeClass: '',
  });

  useEffect(() => {
    if (vague) {
      setFormData({
        CodeVague: vague.CodeVague,
        libelleVague: vague.libelleVague,
        CodeClass: vague.CodeClass,
      });
    }
  }, [vague]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.CodeVague || !formData.libelleVague || !formData.CodeClass) {
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
          {modalType === 'add' ? 'Ajouter Vague' : 'Modifier Vague'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code Vague"
                name="CodeVague"
                value={formData.CodeVague}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
            <Select
                fullWidth
                label="Libelle"
                name="libelleVague"
                value={formData.libelleVague}
                onChange={handleChange}
                required>
                   <option value='L1'>L1</option>
                   <option value='L2'>L2</option>
                </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                label="Code Classe"
                name="CodeClass"
                value={formData.CodeClass}
                onChange={handleChange}
                required>
                   <option value='L1'>L1</option>
                   <option value='L2'>L2</option>
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

export default VagueForm;
