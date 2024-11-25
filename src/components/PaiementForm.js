import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, TextField, Button, Grid, MenuItem, Modal, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const PaiementForm = ({ open, onClose, onSave, paiementItem, modalType }) => {
  const [formValues, setFormValues] = useState({
    Numero: '',
    Matricule: '',
    Nom: '',
    CodeFrais: [],
    CodeVague: '',
    CodeClass: '',
    montantF: '',
    montantPaye: '',
    restePaye: '',
    mode: '',
    pieceJustificative: '', // Nouvel attribut pour le pièce justificative
    dateP: '',
  });

  const [selectedValues, setSelectedValues] = useState([]); // This should be an array
  const [vagues, setVagues] = useState([]);
  const [frais, setFrais] = useState([]);
  const [totalMontantF, setTotalMontantF] = useState(0); // Total montantF sum

  useEffect(() => {
    if (modalType === 'edit' && paiementItem) {
      setFormValues({
        Numero: paiementItem.Numero || '',
        Matricule: paiementItem.Matricule || '',
        Nom: paiementItem.Nom || '',
        CodeFrais: paiementItem.CodeFrais || [],
        CodeVague: paiementItem.CodeVague || [],
        CodeClass: paiementItem.CodeClass || [],
        montantF: paiementItem.montantF || '',
        montantPaye: paiementItem.montantPaye || '',
        restePaye: paiementItem.restePaye || '',
        mode: paiementItem.mode || '',
        dateP: paiementItem.dateP || '',
      });
    } else if (modalType === 'add') {
      setFormValues({
        Numero: '',
        Matricule: '',
        Nom: '',
        CodeFrais: [],
        CodeVague: '',
        CodeClass: '',
        montantF: '',
        montantPaye: '',
        restePaye: '',
        mode: '',
        pieceJustificative: '', // Nouvel attribut pour le pièce justificative
        dateP: '',
      });
    }
  }, [paiementItem, modalType]);

  // Calculate restePaye based on montantF and montantPaye
  useEffect(() => {
    const { montantF, montantPaye } = formValues;
    const restePaye = montantF && montantPaye ? montantF - montantPaye : '';
    setFormValues(prevValues => ({ ...prevValues, restePaye }));
  }, [formValues.montantF, formValues.montantPaye]);

  // Fetch data for vagues and frais
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      axios.get('http://localhost:5000/api/vagues/vagues'),
      axios.get('http://localhost:5000/api/frais/frais')
    ])
      .then(([vaguesResponse, fraisResponse]) => {
        setVagues(vaguesResponse.data);
        setFrais(fraisResponse.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'CodeFrais') {
      const values = Array.from(e.target.selectedOptions, (option) => option.value);
      setSelectedValues(values);
      setFormValues((prevValues) => ({ ...prevValues, CodeFrais: values }));
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  // If CodeFrais is changed, update the total montantF sum
  useEffect(() => {
    if (selectedValues.length > 0 && frais.length > 0) {
      const totalMontantF = selectedValues.reduce((total, value) => {
        const fraisItem = frais.find((f) => f.CodeFrais === value);
        return total + (fraisItem ? parseFloat(fraisItem.montantF) : 0);
      }, 0);
      setTotalMontantF(totalMontantF);
      setFormValues(prevValues => ({ ...prevValues, montantF: totalMontantF }));
    } else {
      setTotalMontantF(0);
      setFormValues(prevValues => ({ ...prevValues, montantF: 0 }));
    }
  }, [selectedValues, frais]);

  const handleSave = () => {
    const codeFraisString = selectedValues.join(',');
    const modeString = `${formValues.mode} - ${formValues.pieceJustificative}`;
    const formData = {...formValues, CodeFrais: codeFraisString, mode: modeString };
    onSave(formData);
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
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
          {modalType === 'add' ? 'Ajouter un paiement' : 'Modifier le paiement'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Numero"
              name="Numero"
              value={formValues.Numero}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Matricule"
              name="Matricule"
              value={formValues.Matricule}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Nom"
              name="Nom"
              value={formValues.Nom}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              fullWidth
              label="Code Vague"
              name="CodeVague"
              value={formValues.CodeVague}
              onChange={handleChange}
            >
              {vagues.map((vague, i) => (
                <MenuItem key={i} value={vague.CodeVague}>
                  {vague.CodeVague}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              fullWidth
              name="CodeClass"
              value={formValues.CodeClass}
              onChange={handleChange}
            >
              {vagues.map((vague, i) => (
                <MenuItem key={i} value={vague.CodeClass}>
                  {vague.CodeClass}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              fullWidth
              name="CodeFrais"
              value={selectedValues}
              onChange={(e) => {
                const values = e.target.value;
                setSelectedValues(values);
                setFormValues((prevValues) => ({ ...prevValues, CodeFrais: values }));
              }}
              multiple
            >
              {frais.map((frais, i) => (
                <MenuItem key={i} value={frais.CodeFrais}>
                  {frais.CodeFrais}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Montant Total des Frais"
              name="totalMontantF"
              value={totalMontantF}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Montant Payé"
              name="montantPaye"
              value={formValues.montantPaye}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Reste à payer"
              name="restePaye"
              value={formValues.restePaye}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              fullWidth
              name="mode"
              value={formValues.mode}
              onChange={(e) => {
                const value = e.target.value;
                setFormValues((prevValues) => ({ ...prevValues, mode: value }));
                if (value === 'Direct') {
                  setFormValues((prevValues) => ({ ...prevValues, pieceJustificative: 'Numero de paiement' }));
                } else if (value === 'Banque') {
                  setFormValues((prevValues) => ({ ...prevValues, pieceJustificative: 'Numero de recu' }));
                } else if (value === 'Mvola') {
                  setFormValues((prevValues) => ({ ...prevValues, pieceJustificative: 'Reference' }));
                }
              }}
            >
              <MenuItem value="Direct">Direct</MenuItem>
              <MenuItem value="Banque">Banque</MenuItem>
              <MenuItem value="Mvola">Mvola</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            {formValues.mode && (
              <TextField
                margin="dense"
                label={formValues.pieceJustificative}
                name="pieceJustificative"
                value={formValues.pieceJustificative}
                onChange={handleChange}
                fullWidth
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              label="Date"
              name="dateP"
              value={formValues.dateP}
              onChange={handleChange}
              type="date"
              fullWidth
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
    </Modal>
  );
};

export default PaiementForm;