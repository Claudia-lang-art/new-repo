import React, { useState, useEffect } from 'react';
import { getClasses, createClasses, updateClasses, deleteClasses } from '../services/api'; // Import API services
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Modal, Button, Typography, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ClassForm from './ClassForm'; // Updated import
import axios from 'axios';


const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentClasse, setCurrentClasse] = useState(null);
  const [formValues, setFormValues] = useState({ codeClasse: '', libelleClasse: '', libelleOption: '' });
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);


  useEffect(() => {
    axios.get('http://localhost:5000/api/classes/classes')
      .then(response => {
        setClasses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError('Failed to fetch students');
        setLoading(false);
      });
  }, []);


  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentClasse(null);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/classes/classes/${currentClasse.id}`, formValues);
      setClasses(classes.map(classe => (classe.id === currentClasse.id ? { ...classe, ...formValues } : classe)));
      handleCloseModal();
      setOpenConfirmModal(false);
      setOpenSuccessModal(true);
      setTimeout(() => setOpenSuccessModal(false), 2000); // Close the success modal after 3 seconds
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };
  
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Liste des Classes
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, marginRight: '15%' }}>
        <Button  variant="contained" color="primary" sx={{ bgcolor: "#FF69B4" }}>
          Ajouter Classe
          <AddIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ width: '70%', mx: 'auto', marginTop: '4%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code Classe</TableCell>
              <TableCell>Libelle</TableCell>
              <TableCell>Libelle Option</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.codeClasse}</TableCell>
                <TableCell>{classItem.libelleClasse}</TableCell>
                <TableCell>{classItem.libelleOption}</TableCell>
                <TableCell>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for ClassForm */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <ClassForm
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSave}
          classItem={selectedClass}
          modalType={modalType}
        />
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClassList;
