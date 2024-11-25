import React, { useState, useEffect } from 'react';
import { getFrais, addFrais, deleteFrais } from '../services/api';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, CheckCircle as CheckCircleIcon, Close as CloseIcon } from '@mui/icons-material';

const FraisList = () => {
  const [loading, setLoading] = useState(true);
  const [frais, setFrais] = useState([]);
  const [currentFrais, setCurrentFrais] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [openDeleteSuccessModal, setOpenDeleteSuccessModal] = useState(false);
  const [formValues, setFormValues] = useState({ CodeFrais: '', libelleFrais: '', montantF: '' });

  const fetchFrais = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/frais/frais');
      setFrais(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des vagues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrais();
  }, []);


  
  const handleAdd = () => {
    setCurrentFrais(null);
    setFormValues({ CodeFrais: '', libelleFrais: '', montantF: '' }); // Reset form values
    setOpenModal(true);
  };

  const handleEdit = (frais) => {
    setCurrentFrais(frais);
    setFormValues({ CodeFrais: frais.CodeFrais, libelleFrais: frais.libelleFrais, montantF: frais.montantF });
    setOpenModal(true);
  };

  const handleDelete = (frais) => {
    setCurrentFrais(frais);
    setOpenDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/frais/frais/${currentFrais.CodeFrais}`);
      setFrais(frais.filter(frais => frais.CodeFrais !== currentFrais.CodeFrais));
      setOpenDeleteConfirmModal(false);
      setOpenDeleteSuccessModal(true);
      setTimeout(() => setOpenDeleteSuccessModal(false), 2000);
    } catch (error) {
      console.error('Échec de la suppression de la vague:', error);
    }
  };

  
  const handleSave = async () => {
    try {
      if (currentFrais) {
        await axios.put(`http://localhost:5000/api/frais/frais/${currentFrais.CodeFrais}`, formValues);
      } else {
        await axios.post('http://localhost:5000/api/frais/frais', formValues);
      }
      fetchFrais();
      setOpenModal(false);
      setOpenSuccessModal(true);
      setTimeout(() => setOpenSuccessModal(false), 2000);
    } catch (error) {
      console.error('Échec de l’enregistrement de la vague:', error);
    }
  };

  if (loading) return <p>Loading...</p>;


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Frais
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ bgcolor: '#FF69B4', marginRight: '15%'  }}>
          Ajouter Frais <AddIcon />
        </Button>
      </Box>

      <Box sx={{ width: '70%', flexGrow: 1, border: '1px solid #ddd', overflowY: 'auto', maxHeight: '60vh', margin:'0 auto' }}>
      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Code Frais</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Libellé</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Montant</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {frais.map((frais) => (
              <TableRow key={frais.CodeFrais}>
                <TableCell>{frais.CodeFrais}</TableCell>
                <TableCell>{frais.libelleFrais}</TableCell>
                <TableCell>{frais.montantF}</TableCell>
                <TableCell>
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleEdit(frais)} sx={{ color: '#1976d2' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDelete(frais)} sx={{ color: '#d32f2f' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* Modal for Adding/Editing Vague */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
        <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
          >
            <CloseIcon />
          </IconButton>
          {currentFrais ? 'Modifier une frais' : 'Ajouter une Frais'}</DialogTitle>
        <DialogContent>
        frais
        <TextField
                fullWidth
                label="Code Frais"
                name="CodeFrais"
                value={formValues.CodeFrais}
                onChange={(e) => setFormValues({ ...formValues, CodeFrais: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
          <Select
                  fullWidth
                  label="Libelle"
                  name="libelleFrais"
                  value={formValues.libelleFrais}
                  onChange={(e) => setFormValues({ ...formValues, libelleFrais: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Droit d'inscription">Droit d'inscription</MenuItem>
                  <MenuItem value="Droit d'examin">Droit d'examin</MenuItem>
                  <MenuItem value="Frais generaux">Frais generaux</MenuItem>
                  <MenuItem value="1 Ecolage">  1 Ecolage</MenuItem>
                  <MenuItem value="2 Ecolage">2 Ecolage</MenuItem>
                  <MenuItem value="3 Ecolage">3 Ecolage</MenuItem>
                  <MenuItem value="4 Ecolage">4 Ecolage</MenuItem>
                  <MenuItem value="5 Ecolage">5 Ecolage</MenuItem>
                  <MenuItem value="6 Ecolage">6 Ecolage</MenuItem>
                  <MenuItem value="7 Ecolage">7 Ecolage</MenuItem>
                  <MenuItem value="8 Ecolage">8 Ecolage</MenuItem>
                  <MenuItem value="9 Ecolage">9 Ecolage</MenuItem>
                  <MenuItem value="10 Ecolage">10 Ecolage</MenuItem>                  </Select>

                <Select
                  fullWidth
                  label="Montant"
                  name="montantF"
                  value={formValues.montantF}
                  onChange={(e) => setFormValues({ ...formValues, montantF: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="100000">100000</MenuItem>
                  <MenuItem value="20000">20000</MenuItem>
                  <MenuItem value="40000">40000</MenuItem>
                  <MenuItem value="65000">65000</MenuItem>
                  <MenuItem value="62000">62000</MenuItem>
                </Select>

        </DialogContent>
        <DialogActions>
          <Button 
          onClick={handleSave}
          fullWidth 
          sx={{ bgcolor: '#FF69B4', color: 'white' }}>
            {currentFrais ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for Deleting Vague */}
      <Dialog open={openDeleteConfirmModal} onClose={() => setOpenDeleteConfirmModal(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la vague {currentFrais?.libelleFrais} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmModal(false)} color="primary">Annuler</Button>
          <Button onClick={confirmDelete} sx={{ bgcolor: '#d32f2f', color: 'white' }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal for Saving Vague */}
      <Dialog open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#f48fb1' }} />
          <Typography variant="h6">Modification réussie !</Typography>
          <Typography>L'action a été effectuée avec succès.</Typography>
        </DialogContent>
      </Dialog>

      {/* Success Modal for Deleting Vague */}
      <Dialog open={openDeleteSuccessModal} onClose={() => setOpenDeleteSuccessModal(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#f48fb1' }} />
          <Typography variant="h6">Suppression réussie !</Typography>
          <Typography>La vague a été supprimée avec succès.</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FraisList;
