import React, { useEffect, useState } from 'react';
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

const VagueList = () => {
  const [vagues, setVagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVague, setCurrentVague] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [openDeleteSuccessModal, setOpenDeleteSuccessModal] = useState(false);
  const [formValues, setFormValues] = useState({ CodeVague: '', libelleVague: '', CodeClass: '' });

  const fetchVagues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vagues/vagues');
      setVagues(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des vagues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVagues();
  }, []);

  const handleAdd = () => {
    setCurrentVague(null);
    setFormValues({ CodeVague: '', libelleVague: '', CodeClass: '' });
    setOpenModal(true);
  };

  const handleEdit = (vague) => {
    setCurrentVague(vague);
    setFormValues({ CodeVague: vague.CodeVague, libelleVague: vague.libelleVague, CodeClass: vague.CodeClass });
    setOpenModal(true);
  };

  const handleDelete = (vague) => {
    setCurrentVague(vague);
    setOpenDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/vagues/vagues/${currentVague.CodeVague}`);
      setVagues(vagues.filter(vague => vague.CodeVague !== currentVague.CodeVague));
      setOpenDeleteConfirmModal(false);
      setOpenDeleteSuccessModal(true);
      setTimeout(() => setOpenDeleteSuccessModal(false), 2000);
    } catch (error) {
      console.error('Échec de la suppression de la vague:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (currentVague) {
        await axios.put(`http://localhost:5000/api/vagues/vagues/${currentVague.CodeVague}`, formValues);
      } else {
        await axios.post('http://localhost:5000/api/vagues/vagues', formValues);
      }
      fetchVagues();
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
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Liste des Vagues
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ bgcolor: '#FF69B4', marginRight: '15%' }}>
          Ajouter Vague <AddIcon />
        </Button>
      </Box>

      <Box sx={{ width: '70%', flexGrow: 1, border: '1px solid #ddd', overflowY: 'auto', maxHeight: '60vh', margin:'0 auto'  }}>
      <TableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 900 }}>
      <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Code Vague</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Libellé</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Code Classe</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vagues.map((vague) => (
              <TableRow key={vague.CodeVague}>
                <TableCell>{vague.CodeVague}</TableCell>
                <TableCell>{vague.libelleVague}</TableCell>
                <TableCell>{vague.CodeClass}</TableCell>
                <TableCell>
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleEdit(vague)} sx={{ color: '#1976d2' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDelete(vague)} sx={{ color: '#d32f2f' }}>
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth >
        <DialogTitle>
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
          >
            <CloseIcon />
          </IconButton>
          {currentVague ? 'Modifier la Vague' : 'Ajouter une Vague'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Code Vague"
            type="text"
            fullWidth
            variant="outlined"
            value={formValues.CodeVague}
            onChange={(e) => setFormValues({ ...formValues, CodeVague: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            label="Libelle"
            name="libelleVague"
            value={formValues.libelleVague}
            onChange={(e) => setFormValues({ ...formValues, libelleVague: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="vague 1">vague 1</MenuItem>
            <MenuItem value="vague 2">vague 2</MenuItem>
            <MenuItem value="vague 3">vague 3</MenuItem>
            <MenuItem value="vague 4">vague 4</MenuItem>
            <MenuItem value="vague 5">vague 5</MenuItem>
          </Select>
          <Select
            fullWidth
            label="Code Classe"
            name="CodeClass"
            value={formValues.CodeClass}
            onChange={(e) => setFormValues({ ...formValues, CodeClass: e.target.value })}
            required
          >
            <MenuItem value="V1L1">V1L1</MenuItem>
            <MenuItem value="V2L1">V2L1</MenuItem>
            <MenuItem value="V3L1">V3L1</MenuItem>
            <MenuItem value="V4L1">V4L1</MenuItem>
            <MenuItem value="V1L2">V1L2</MenuItem>
            <MenuItem value="V2L2">V2L2</MenuItem>
            <MenuItem value="V3L2">V3L2</MenuItem>
            <MenuItem value="V4L2">V4L2</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            fullWidth
            sx={{ bgcolor: '#FF69B4', color: 'white' }}
          >
            {currentVague ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for Deleting Vague */}
      <Dialog open={openDeleteConfirmModal} onClose={() => setOpenDeleteConfirmModal(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la vague {currentVague?.libelleVague} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmModal(false)} color="primary">Annuler</Button>
          <Button onClick={confirmDelete} sx={{ bgcolor: '#d32f2f', color: 'white' }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modals */}
      <Dialog open={openSuccessModal}>
        <DialogContent sx={{ textAlign: 'center', color: '#4caf50' }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />
          <Typography variant="h6">Enregistrement réussi !</Typography>
          <Typography>La vague a été enregistrée avec succès.</Typography>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteSuccessModal}>
        <DialogContent sx={{ textAlign: 'center', color: '#d32f2f' }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#d32f2f' }} />
          <Typography variant="h6">Suppression réussie !</Typography>
          <Typography>La vague a été supprimée avec succès.</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VagueList;
