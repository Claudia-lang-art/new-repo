import React, { useState, useEffect } from'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const PaiementsEtudiant = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/paiement/paiement')
     .then(response => {
        setPaiements(response.data);
        setLoading(false);
      })
     .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Matricule</TableCell>
          <TableCell>Nom</TableCell>
          <TableCell>Code Frais</TableCell>
          <TableCell>Montant Payé</TableCell>
          <TableCell>Reste à Payer</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paiements.map((paiement, index) => (
          <TableRow key={index}>
            <TableCell>{paiement.Matricule}</TableCell>
            <TableCell>{paiement.Nom}</TableCell>
            <TableCell>{paiement.CodeFrais}</TableCell>
            <TableCell>{paiement.MontantPayé}</TableCell>
            <TableCell>{paiement.ResteAPayer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PaiementsEtudiant;