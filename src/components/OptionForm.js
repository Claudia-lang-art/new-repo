import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, TextField, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const OptionForm = ({ open, onClose, onSave, option, modalType }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    value: '',
  });

  useEffect(() => {
    if (option) {
      setFormValues({
        name: option.name || '',
        value: option.value || '',
      });
    } else {
      setFormValues({
        name: '',
        value: '',
      });
    }
  }, [option]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = () => {
    onSave(formValues);
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
          {modalType === 'add' ? 'Ajouter une Option' : 'Modifier l\'Option'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="codeOption"
              fullWidth
              name="code Option"
              value={formValues.codeOption}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="libelleOption"
              fullWidth
              name="libelle Option"
              value={formValues.libelleOption}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="libelleSection"
              fullWidth
              name="libelle Section"
              value={formValues.libelleSection}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ bgcolor: "#FF69B4", mt: 3, width: '100%' }}
        >
          {modalType === 'add' ? 'Ajouter' : 'Confirmer la modification'}
        </Button>
      </Box>
    )
  );
};

export default OptionForm;
