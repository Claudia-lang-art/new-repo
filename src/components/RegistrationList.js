import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getPayments } from '../services/api';
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  Button,
  IconButton,
  Typography,

}
from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Receipt as ReceiptIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import RegisterForm from './RegistrationForm';

const RegistrationList = ({ codeClasse }) => {
  const [students, setStudents] = useState([]); // Définir students et setStudents  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);


  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/paiement/paiement');
      const studentsData = response.data.filter((paiement) => paiement.restePaye === 0).map((paiement) => {
        const frais = paiement.CodeFrais.split(',');
        const ecolage = frais.filter((frais) => frais.startsWith('1E') || frais.startsWith('2E'));
        const ecolageNumber = ecolage.map((ecolage) => ecolage.slice(-1));
        return {
          matricule: paiement.Matricule,
          nom: paiement.Nom,
          classe: paiement.CodeClass,
          droitInscription: frais.includes('DI'),
          droitExamen: frais.includes('DE'),
          fraisGeneraux: frais.includes('FG'),
          ecolage1: ecolageNumber.includes('1'),
          ecolage2: ecolageNumber.includes('2'),
          ecolage3: ecolageNumber.includes('3'),
          ecolage4: ecolageNumber.includes('4'),
          ecolage5: ecolageNumber.includes('5'),
          ecolage6: ecolageNumber.includes('6'),
          ecolage7: ecolageNumber.includes('7'),
          ecolage8: ecolageNumber.includes('8'),
          ecolage9: ecolageNumber.includes('9'),
          ecolage10: ecolageNumber.includes('10'),
        };
    }).filter((student) => student.classe === codeClasse);
    setStudents(studentsData);
  } catch (error) {
    console.error('Error fetching students:', error);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/paiement/paiement/${id}`);
      setStudents(students.filter((student) => student.id!== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/paiement/paiement/${id}`);
      const student = response.data;
      setCurrentStudent(student);
      setModalType('edit');
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/paiement/paiements/search`, {
        params: { query: searchQuery },
      });
      const studentsData = response.data;
      setStudents(studentsData);
    } catch (error) {
      console.error('Error searching students:', error);
    }
  };

  return (
    <Box p={3}>
    <Typography variant="h4" gutterBottom>
      Liste des Paiements
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3 }}>
          <TextField
            label="Rechercher par Numéro, Nom ou Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size='small'
          />
          <Button onClick={handleSearch} variant="contained" color="primary" sx={{ bgcolor: '#FF69B4', ml: 2 }}>
            Rechercher
          </Button>
        </Box>
      <Box sx={{ width: '100%', flexGrow: 1, border: '1px solid #ddd', overflowY: 'auto', maxHeight: '60vh' }}>
        <TableContainer component={Paper}>
          <Table stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Matricule</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Classe</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Droit d'inscription</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Droit d'examen</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Frais généraux</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 1</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 2</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 3</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 4</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 5</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 6</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 7</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 8</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 9</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Écolage 10</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.matricule}</TableCell>
                  <TableCell>{student.nom}</TableCell>
                  <TableCell>{student.classe}</TableCell>
                  <TableCell>{student.droitInscription ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.droitExamen ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.fraisGeneraux ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage1 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage2 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage3 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage4 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage5 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage6 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage7 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage8 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage9 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{student.ecolage10 ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(student.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(student.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {openModal && (
        <RegisterForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={(student) => {
            if (modalType === 'edit') {
              const updatedStudents = students.map((s) => (s.id === student.id? student : s));
              setStudents(updatedStudents);
            } else {
              setStudents([...students, student]);
            }
          }}
          student={currentStudent}
          modalType={modalType}
        />
      )}
    </Box>
  );
};
export default RegistrationList;