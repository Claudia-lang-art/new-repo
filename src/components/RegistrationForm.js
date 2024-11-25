import React, { useState } from'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const RegisterForm = ({ open, onClose, onSave, studentItem, modalType }) => {
  const [matricule, setMatricule] = useState(studentItem? studentItem.matricule : '');
  const [nom, setNom] = useState(studentItem? studentItem.nom : '');
  const [classe, setClasse] = useState(studentItem? studentItem.classe : '');
  const [droitInscription, setDroitInscription] = useState(studentItem? studentItem.droitInscription : false);
  const [droitExamen, setDroitExamen] = useState(studentItem? studentItem.droitExamen : false);
  const [fraisGeneraux, setFraisGeneraux] = useState(studentItem? studentItem.fraisGeneraux : false);
  const [ecolage, setEcolage] = useState(studentItem? studentItem.ecolage : {});

  const handleSave = () => {
    const student = {
      matricule,
      nom,
      classe,
      droitInscription,
      droitExamen,
      fraisGeneraux,
      ecolage,
    };
    onSave(student);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{modalType === 'add'? 'Ajouter un étudiant' : 'Modifier un étudiant'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {modalType === 'add'? 'Entrez les informations de l\'étudiant à ajouter' : 'Entrez les informations de l\'étudiant à modifier'}
        </DialogContentText>
        <TextField
          label="Matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Classe"
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
          margin="normal"
          fullWidth
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={droitInscription}
              onChange={(e) => setDroitInscription(e.target.checked)}
            />
            Droit d'inscription
          </label>
          <label>
            <input
              type="checkbox"
              checked={droitExamen}
              onChange={(e) => setDroitExamen(e.target.checked)}
            />
            Droit d'examen
          </label>
          <label>
            <input
              type="checkbox"
              checked={fraisGeneraux}
              onChange={(e) => setFraisGeneraux(e.target.checked)}
            />
            Frais généraux
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage1}
              onChange={(e) => setEcolage({...ecolage, ecolage1: e.target.checked })}
            />
            Écolage 1
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage2}
              onChange={(e) => setEcolage({...ecolage, ecolage2: e.target.checked })}
            />
            Écolage 2
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage3}
              onChange={(e) => setEcolage({...ecolage, ecolage3: e.target.checked })}
            />
            Écolage 3
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage4}
              onChange={(e) => setEcolage({...ecolage, ecolage4: e.target.checked })}
            />
            Écolage 4
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage5}
              onChange={(e) => setEcolage({...ecolage, ecolage5: e.target.checked })}
            />
            Écolage 5
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage6}
              onChange={(e) => setEcolage({...ecolage, ecolage6: e.target.checked })}
            />
            Écolage 6
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage7}
              onChange={(e) => setEcolage({...ecolage, ecolage7: e.target.checked })}
            />
            Écolage 7
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage8}
              onChange={(e) => setEcolage({...ecolage, ecolage8: e.target.checked })}
            />
            Écolage 8
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage9}
              onChange={(e) => setEcolage({...ecolage, ecolage9: e.target.checked })}
            />
            Écolage 9
          </label>
          <label>
            <input
              type="checkbox"
              checked={ecolage.ecolage10}
              onChange={(e) => setEcolage({...ecolage, ecolage10: e.target.checked })}
            />
            Écolage 10
          </label>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Annuler</Button>
        <Button onClick={handleSave}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterForm;