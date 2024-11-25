import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { getPayments, deletePayment, addPayment } from '../services/api';
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import autoTable plugin for table support in PDF

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
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Receipt as ReceiptIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import PaiementForm from './PaiementForm';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentPaiement, setCurrentPaiement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [deletePaiementNumero, setDeletePaiementNumero] = useState(null);
  const [openDeleteSuccessModal, setOpenDeleteSuccessModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const fetchPaiements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/paiement/paiement');
      setPayments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  const handleAdd = async (newPaiement) => {
    try {
      await axios.post('http://localhost:5000/api/paiement/paiement', newPaiement);
      setSnackbarMessage('Paiement ajouté avec succès!');
      setOpenSnackbar(true);
      fetchPaiements();
      setOpenSuccessModal(true); 
    } catch (error) {
      setSnackbarMessage(`Échec de l’ajout: ${error.message}`);
      setOpenSnackbar(true);
    }
    setOpenModal(false);
  };

  const handleEdit = async (updatedPaiement) => {
    try {
      await axios.put(`http://localhost:5000/api/paiement/paiement/${updatedPaiement.Numero}`, updatedPaiement);
      setSnackbarMessage('Paiement modifié avec succès!');
      setOpenSnackbar(true);
      fetchPaiements();
      setOpenSuccessModal(true);
    } catch (error) {
      console.error('Failed to update paiement:', error);
    }
    setOpenModal(false);
  };

  const handleDeleteConfirmation = (paiementNumero) => {
    setDeletePaiementNumero(paiementNumero);
    setOpenDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/paiement/paiement/${deletePaiementNumero}`);
      setSnackbarMessage('Paiement supprimé avec succès!');
      setOpenSnackbar(true);
      fetchPaiements();
      setOpenDeleteSuccessModal(true);
    } catch (error) {
      setSnackbarMessage(`Échec de la suppression: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenDeleteConfirmModal(false);
    }
  };

  // Génération de la facture PDF
  const generateInvoice = (paiement) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Facture de Paiement', 14, 22);
    doc.setFontSize(12);
    doc.text(`Numéro de Paiement: ${paiement.Numero}`, 14, 32);
    doc.text(`Nom: ${paiement.Nom}`, 14, 42);
    doc.text(`Montant Payé: ${paiement.montantPaye} FCFA`, 14, 52);
    doc.text(`Reste à Payer: ${paiement.restePaye} FCFA`, 14, 62);
    doc.text(`Date de Paiement: ${moment(paiement.dateP).format('DD/MM/YYYY')}`, 14, 72);
    doc.text(`Mode de Paiement: ${paiement.mode}`, 14, 82);

    // Sauvegarder le fichier PDF
    doc.save(`facture_paiement_${paiement.Numero}.pdf`);
  };

  const handleSearch = async () => {
    try {
      if (searchQuery) {
        const response = await axios.get(`http://localhost:5000/api/paiement/paiements/search`, {
          params: { query: searchQuery },
        });
        const resultData = Array.isArray(response.data) ? response.data : [response.data];
        setPayments(resultData);
      } else {
        fetchPaiements();
      }
    } catch (error) {
      console.error('Error during search:', error);
      setPayments([]);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Liste des Paiements
      </Typography>
      <TextField
        label="Rechercher par Numéro, Nom ou Date"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
      />
      <Button onClick={handleSearch} variant="contained" color="primary" sx={{ bgcolor: '#FF69B4' }}>
        Rechercher
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button onClick={() => { setModalType('add'); setCurrentPaiement(null); setOpenModal(true); }} variant="contained" color="primary" sx={{ bgcolor: '#FF69B4' }}>
          Ajouter Paiement <AddIcon />
        </Button>
      </Box>
      <Box sx={{ width: '100%', flexGrow: 1, border: '1px solid #ddd', overflowY: 'auto', maxHeight: '60vh' }}>
        <TableContainer component={Paper}>
          <Table stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Numero</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Matricule</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Code Frais</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Code Vague</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Code Classe</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Montant à Payer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Montant Payé</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Reste à Payer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Mode de Paiement</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((paiement) => (
                <TableRow key={paiement.Numero}>
                  <TableCell>{paiement.Numero}</TableCell>
                  <TableCell>{paiement.Matricule}</TableCell>
                  <TableCell>{paiement.Nom}</TableCell>
                  <TableCell>{paiement.CodeFrais}</TableCell>
                  <TableCell>{paiement.CodeVague}</TableCell>
                  <TableCell>{paiement.CodeClass}</TableCell>
                  <TableCell>{paiement.montantF}</TableCell>
                  <TableCell>{paiement.montantPaye}</TableCell>
                  <TableCell>{paiement.restePaye}</TableCell>
                  <TableCell>{moment(paiement.dateP).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{paiement.mode}</TableCell>
                  <TableCell>
                    <Tooltip title="Modifier">
                      <IconButton color="primary" onClick={() => { setModalType('edit'); setCurrentPaiement(paiement); setOpenModal(true); }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton color="error" onClick={() => handleDeleteConfirmation(paiement.Numero)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Générer la facture">
                      <IconButton color="success" onClick={() => generateInvoice(paiement)}>
                        <ReceiptIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PaymentList;





import React, { useState, useEffect } from'react';
import axios from 'axios';
import { getPayments } from '../services/api';

const RegisterList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/paiement/paiement');
      const studentsData = response.data.filter((paiement) => {
        const restePaye = parseFloat(paiement.restePaye);
        return Number.isInteger(restePaye) && restePaye === 0;
      }).map((paiement) => {        const frais = paiement.CodeFrais.split(',');
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
      });
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Liste des étudiants</h1>
      <table>
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Classe</th>
            <th>Droit d'inscription</th>
            <th>Droit d'examen</th>
            <th>Frais généraux</th>
            <th>Écolage 1</th>
            <th>Écolage 2</th>
            <th>Écolage 3</th>
            <th>Écolage 4</th>
            <th>Écolage 5</th>
            <th>Écolage 6</th>
            <th>Écolage 7</th>
            <th>Écolage 8</th>
            <th>Écolage 9</th>
            <th>Écolage 10</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.matricule}</td>
              <td>{student.nom}</td>
              <td>{student.classe}</td>
              <td>{student.droitInscription? 'Oui' : 'Non'}</td>
              <td>{student.droitExamen? 'Oui' : 'Non'}</td>
              <td>{student.fraisGeneraux? 'Oui' : 'Non'}</td>
              <td>{student.ecolage1? 'Oui' : 'Non'}</td>
              <td>{student.ecolage2? 'Oui' : 'Non'}</td>
              <td>{student.ecolage3? 'Oui' : 'Non'}</td>
              <td>{student.ecolage4? 'Oui' : 'Non'}</td>
              <td>{student.ecolage5? 'Oui' : 'Non'}</td>
              <td>{student.ecolage6? 'Oui' : 'Non'}</td>
              <td>{student.ecolage7? 'Oui' : 'Non'}</td>
              <td>{student.ecolage8? 'Oui' : 'Non'}</td>
              <td>{student.ecolage9? 'Oui' : 'Non'}</td>
              <td>{student.ecolage10? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterList;


import * as React from'react';
import { PieChart } from '@mui/x-charts/PieChart';

const statistiques = {
  nombreTotalEtudiantsInscrits: 1000,
  totalFraisScolairesPayes: 100000,
  pourcentagePaiementsEnRetard: 20,
};

export default function Statistiques() {
  return (
    <div>
      <h2>Statistiques</h2>
      <h3>Nombre total d'étudiants inscrits</h3>
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: statistiques.nombreTotalEtudiantsInscrits,
                label: 'Nombre total d\'étudiants inscrits',
              },
              {
                id: 1,
                value: 0,
                label: 'Autres',
              },
            ],
          },
        ]}
        width={400}
        height={200}
      />
      <h3>Total des frais scolaires payés</h3>
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: statistiques.totalFraisScolairesPayes,
                label: 'Total des frais scolaires payés',
              },
              {
                id: 1,
                value: 0,
                label: 'Autres',
              },
            ],
          },
        ]}
        width={400}
        height={200}
      />
      <h3>Pourcentage de paiements en retard</h3>
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: statistiques.pourcentagePaiementsEnRetard,
                label: 'Pourcentage de paiements en retard',
              },
              {
                id: 1,
                value: 100 - statistiques.pourcentagePaiementsEnRetard,
                label: 'Pourcentage de paiements à temps',
              },
            ],
          },
        ]}
        width={400}
        height={200}
      />
    </div>
  );
}

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