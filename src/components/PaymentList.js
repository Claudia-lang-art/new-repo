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


  // Confirmation modals
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
      setSnackbarMessage('paiement ajouté avec succès!');
      setOpenSnackbar(true);
      fetchPaiements();
      setOpenSuccessModal(true); // Show success modal
    } catch (error) {
      setSnackbarMessage(`Échec de l’ajout: ${error.message}`);
      setOpenSnackbar(true);
    }
    setOpenModal(false);
  };

  const handleEdit = async (updatedPaiement) => {
    try {
      await axios.put(`http://localhost:5000/api/paiement/paiement/${updatedPaiement.Numero}`, updatedPaiement);
      setSnackbarMessage('Étudiant modifié avec succès!');
      setOpenSnackbar(true);
      fetchPaiements();
      setOpenSuccessModal(true); // Show success modal
    } catch (error) {
      console.error('Failed to update student:', error);
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
      setSnackbarMessage('Étudiant supprimé avec succès!');
      setOpenSnackbar(true);
      fetchPaiements();
      setOpenDeleteSuccessModal(true); // Show success modal
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
    doc.text(`Matricule: ${paiement.Matricule}`, 14, 42);
    doc.text(`Nom: ${paiement.Nom}`, 14, 52);
    doc.text(`Code Frais: ${paiement.CodeFrais}`, 14, 62);
    doc.text(`Montant Payé: ${paiement.montantPaye} Ar`, 14, 72);
    doc.text(`Reste à Payer: ${paiement.restePaye} Ar`, 14, 82);
    doc.text(`Date de Paiement: ${moment(paiement.dateP).format('DD/MM/YYYY')}`, 14, 92);
    doc.text(`Mode de Paiement: ${paiement.mode}`, 14, 102);

    // Sauvegarder le fichier PDF
    doc.save(`facture_paiement_${paiement.Numero}.pdf`);
  };

  // Search payments based on the input
  const handleSearch = async () => {
    try {
      if (searchQuery) {
        const response = await axios.get(`http://localhost:5000/api/paiement/paiements/search`, {
          params: { query: searchQuery },
        });
        console.log('Search API Response:', response.data); // Log the search result
        // Vérifier si la réponse est un objet et le transformer en tableau
        const resultData = Array.isArray(response.data) ? response.data : [response.data]; // Transformer en tableau
        setPayments(resultData); // Mettre à jour l'état avec le tableau
      } else {
        fetchPaiements(); // Afficher tous les paiements si aucune recherche n'est fournie
      }
    } catch (error) {
      console.error('Error during search:', error);
      setPayments([]); // Set to an empty array in case of error
    }
  };

  const today = moment().format('YYYY-MM-DD');
  const totalMontantPayeToday = payments.reduce((acc, paiement) => {
    if (moment(paiement.dateP).format('YYYY-MM-DD') === today) {
      return acc + Number(paiement.montantPaye);
    }
    return acc;
  }, 0);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Liste des Paiements
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent:'space-between', mb: 3 }}>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
    <Paper sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
      <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>
        Montant total payé aujourd'hui : {totalMontantPayeToday} Ar
      </Typography>
    </Paper>
    <Button onClick={() => { setModalType('add'); setCurrentPaiement(null); setOpenModal(true); }} variant="contained" color="primary" sx={{ bgcolor: '#FF69B4' }}>
      Ajouter Paiement <AddIcon />
    </Button>
  </Box>
</Box>
      <Box sx={{ width: '100%', flexGrow: 1, border: '1px solid #ddd', overflowY: 'auto', maxHeight: '60vh' }}>
        <TableContainer component={Paper}>
          <Table stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Numero</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Matricule</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Code Frais </TableCell>
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
                  <TableCell>{paiement.CodeFrais.toString()}</TableCell>                  
                  <TableCell>{paiement.CodeVague}</TableCell>
                  <TableCell>{paiement.CodeClass}</TableCell>
                  <TableCell>{paiement.montantF}</TableCell>
                  <TableCell>{paiement.montantPaye}</TableCell>
                  <TableCell>{paiement.restePaye}</TableCell>
                  <TableCell>{moment(paiement.dateP).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{paiement.mode}</TableCell>
                  <TableCell>
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => { setModalType('edit'); setCurrentPaiement(paiement); setOpenModal(true); }} sx={{ color: '#1976d2' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton onClick={() => handleDeleteConfirmation(paiement.Numero)}>
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
      {openModal && (
        <PaiementForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={modalType === 'add' ? handleAdd : handleEdit}
          paiementItem={currentPaiement}
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
    </Box>


  );
};

export default PaymentList;
