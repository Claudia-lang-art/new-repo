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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [openDeleteSuccessModal, setOpenDeleteSuccessModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formValues, setFormValues] = useState({ nom: '', email: '', password: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormValues({ nom: user.nom, email: user.email, password: user.password });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleConfirmSave = () => {
    setOpenConfirmModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/users/${currentUser.id}`, formValues);
      setUsers(users.map(user => (user.id === currentUser.id ? { ...user, ...formValues } : user)));
      handleCloseModal();
      setOpenConfirmModal(false);
      setOpenSuccessModal(true);
      setTimeout(() => setOpenSuccessModal(false), 2000); // Close the success modal after 3 seconds
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setOpenDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/users/${currentUser.id}`);
      setUsers(users.filter(user => user.id !== currentUser.id));
      setOpenDeleteConfirmModal(false);
      setOpenDeleteSuccessModal(true);
      setTimeout(() => setOpenDeleteSuccessModal(false), 2000); // Close the success modal after 3 seconds
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleAddUser = () => {
    navigate('/register');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, color: 'black' }}>
        Gestion des utilisateurs
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
          sx={{ bgcolor: '#FF69B4' }}
        >
          Ajouter utilisateur
          <AddIcon sx={{ ml: 1 }} />
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Password</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(user)} sx={{ color: '#1976d2' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(user)} sx={{ color: '#d32f2f' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Editing User */}
      <Dialog open={openModal} onClose={handleCloseModal}   PaperProps={{
    sx: { maxWidth: '500px', width: '100%', borderRadius:'10px', paddingBottom:'10px' } // Réduire la largeur du modal
  }}>
        <DialogTitle>
          Modifier l'utilisateur
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>×</span>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="nom"
            label="Nom"
            type="text"
            fullWidth
            variant="outlined"
            value={formValues.nom}
            onChange={handleChange}
            sx={{ marginBottom:'17px', marginTop:'7%'}}

          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formValues.email}
            onChange={handleChange}
            sx={{ marginBottom:'17px'}}

          />
          <TextField
            margin="dense"
            name="password"
            label="Mot de passe"
            type="password"
            fullWidth
            variant="outlined"
            value={formValues.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmSave}
            sx={{ bgcolor: "#FF69B4",width:'93%', marginTop:'-2%',marginRight:'3%', color: 'white', '&:hover': { bgcolor: '#ff4081' } }}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for Editing User */}
      <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} PaperProps={{
    sx: { maxWidth: '350px', width: '100%', borderRadius:'20px' } // Réduire la largeur du modal
  }}>
        <DialogTitle>Confirmer les modifications</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir enregistrer les modifications apportées à l'utilisateur {currentUser?.nom} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmModal(false)}
            sx={{ color: 'black' }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            sx={{ bgcolor: "#FF69B4", color: 'white', '&:hover': { bgcolor: '#ff4081' } }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal for Editing User */}
      <Dialog open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#f48fb1' }} />
          <Typography variant="h6" id="success-modal-title">
            Modification réussie !
          </Typography>
          <Typography id="success-modal-description">
            L'utilisateur a été modifié avec succès.
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Deleting User */}
      <Dialog open={openDeleteConfirmModal} onClose={() => setOpenDeleteConfirmModal(false)}  PaperProps={{
    sx: { maxWidth: '350px', width: '100%', borderRadius:'20px' } // Réduire la largeur du modal
  }}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'utilisateur {currentUser?.nom} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteConfirmModal(false)}
            sx={{ color: 'black' }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{ bgcolor: "#d32f2f", color: 'white', '&:hover': { bgcolor: '#c62828'  } }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal for Deleting User */}
      <Dialog open={openDeleteSuccessModal} onClose={() => setOpenDeleteSuccessModal(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#f48fb1' }} />
          <Typography variant="h6" id="success-delete-modal-title">
            Suppression réussie !
          </Typography>
          <Typography id="success-delete-modal-description">
            L'utilisateur a été supprimé avec succès.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;
