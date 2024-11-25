import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import StudentForm from './StudentForm';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Confirmation modals
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [openDeleteSuccessModal, setOpenDeleteSuccessModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = async (newStudent) => {
    try {
      await axios.post('http://localhost:5000/api/students', newStudent);
      setSnackbarMessage('Étudiant ajouté avec succès!');
      setOpenSnackbar(true);
      fetchStudents();
      setOpenSuccessModal(true); // Show success modal
    } catch (error) {
      setSnackbarMessage(`Échec de l’ajout: ${error.message}`);
      setOpenSnackbar(true);
    }
    setOpenModal(false);
  };

  const handleEdit = async (updatedStudent) => {
    try {
      await axios.put(`http://localhost:5000/api/students/${updatedStudent.Matricule}`, updatedStudent);
      setSnackbarMessage('Étudiant modifié avec succès!');
      setOpenSnackbar(true);
      fetchStudents();
      setOpenSuccessModal(true); // Show success modal
    } catch (error) {
      console.error('Failed to update student:', error);
    }
    setOpenModal(false);
  };

  const handleDeleteConfirmation = (studentId) => {
    setDeleteStudentId(studentId);
    setOpenDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${deleteStudentId}`);
      setSnackbarMessage('Étudiant supprimé avec succès!');
      setOpenSnackbar(true);
      fetchStudents();
      setOpenDeleteSuccessModal(true); // Show success modal
    } catch (error) {
      setSnackbarMessage(`Échec de la suppression: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenDeleteConfirmModal(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Liste des Étudiants
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button onClick={() => { setModalType('add'); setCurrentStudent(null); setOpenModal(true); }} variant="contained" color="primary" sx={{ bgcolor: '#FF69B4' }}>
            Ajouter Étudiant <AddIcon />
          </Button>
        </Box>
        {loading ? (
          <Typography>Chargement...</Typography>
        ) : students.length === 0 ? (
          <Typography>Aucun étudiant trouvé.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow> 
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Matricule</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Prénom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Adresse</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Téléphone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>CodeClass</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>CodeVague</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.Matricule}>
                    <TableCell>{student.Matricule}</TableCell>
                    <TableCell>{student.Nom}</TableCell>
                    <TableCell>{student.Prenom}</TableCell>
                    <TableCell>{student.Adresse}</TableCell>
                    <TableCell>{student.Phone}</TableCell>
                    <TableCell>{student.CodeClass}</TableCell>
                    <TableCell>{student.CodeVague}</TableCell>
                    <TableCell>
                      <Tooltip title="Modifier">
                        <IconButton onClick={() => { setModalType('edit'); setCurrentStudent(student); setOpenModal(true); }} sx={{ color: '#1976d2' }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDeleteConfirmation(student.Matricule)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {openModal && (
        <StudentForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={modalType === 'add' ? handleAdd : handleEdit}
          studentItem={currentStudent}
          modalType={modalType}
        />
      )}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Modal for Deleting Student */}
      <Dialog open={openDeleteConfirmModal} onClose={() => setOpenDeleteConfirmModal(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet étudiant ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmModal(false)} color="primary">Annuler</Button>
          <Button onClick={confirmDelete} color="secondary">Supprimer</Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal for Adding/Editing Student */}
      <Dialog open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#f48fb1' }} />
          <Typography variant="h6">Action réussie !</Typography>
          <Typography>L'étudiant a été {modalType === 'add' ? 'ajouté' : 'modifié'} avec succès.</Typography>
        </DialogContent>
      </Dialog>

      {/* Success Modal for Deleting Student */}
      <Dialog open={openDeleteSuccessModal} onClose={() => setOpenDeleteSuccessModal(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#f48fb1' }} />
          <Typography variant="h6">Suppression réussie !</Typography>
          <Typography>L'étudiant a été supprimé avec succès.</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentList;
