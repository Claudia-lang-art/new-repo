import React, { useState, useEffect } from'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import RegistrationList from './RegistrationList';

const CodeClassePage = () => {
  const [codeClasses, setCodeClasses] = useState([
    'V1L1',
    'V2L1',
    'V3L1',
    'V4L1',
    'V1L2',
    'V2L2',
    'V3L2',
    'V4L2',
  ]);
  const [selectedCodeClasse, setSelectedCodeClasse] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    if (selectedCodeClasse) {
      axios.get(`http://localhost:5000/api/paiement/paiement/codeclasse/${selectedCodeClasse}`)
       .then(response => {
          const filteredStudents = response.data.filter((student) => student.classe === selectedCodeClasse);
          setStudents(filteredStudents);
          handleFilter(); // appelez la fonction handleFilter pour mettre à jour la liste filtrée
        })
       .catch(error => {
          console.error(error);
        });
    }
  }, [selectedCodeClasse, searchCriteria]); // ajoutez searchCriteria à la liste des dépendances
  const handleCodeClasseClick = (codeClasse) => {
    setSelectedCodeClasse(codeClasse);
  };

  const handleSearch = (event) => {
    const { name, value } = event.target;
    setSearchCriteria((prevSearchCriteria) => ({...prevSearchCriteria, [name]: value === 'Oui' }));
    handleFilter(); // appelez la fonction handleFilter pour mettre à jour la liste filtrée
  };

  const handleFilter = () => {
    const filteredStudents = students.filter((student) => {
      let match = true;
      Object.keys(searchCriteria).forEach((key) => {
        if (searchCriteria[key] && student[key]!== 'Oui') {
          match = false;
        }
      });
      return match;
    });
    setFilteredStudents(filteredStudents);
  };

  return (
    <Box>

      {codeClasses.map((codeClasse, index) => (
        <Button key={index} onClick={() => handleCodeClasseClick(codeClasse)} variant="contained"  color="primary" sx={{ mb: 2 , mt : 3 ,mx : 1 , }}>
          {codeClasse}
        </Button>
      ))}
      {selectedCodeClasse && (
        <Box>
          <Box sx={{ mb: 2 }}>
            {/* <Typography variant="h6">Rechercher par frais</Typography>
            <Box>
              <label>
                <input type="checkbox" name="droitInscription" value="Oui" onChange={handleSearch} />
                Droit d'inscription
              </label>
              <label>
                <input type="checkbox" name="droitExamen" value="Oui" onChange={handleSearch} />
                Droit d'examen
              </label>
              <label>
                <input type="checkbox" name="fraisGeneraux" value="Oui" onChange={handleSearch} />
                Frais généraux
              </label>
              <label>
                <input type="checkbox" name="ecolage1" value="Oui" onChange={handleSearch} />
                Écolage 1
              </label>
              <label>
                <input type="checkbox" name="ecolage2" value="Oui" onChange={handleSearch} />
                Écolage 2
              </label>
              <label>
                <input type="checkbox" name="ecolage3" value="Oui" onChange={handleSearch} />
                Écolage 3
              </label>
              <label>
                <input type="checkbox" name="ecolage4" value="Oui" onChange={handleSearch} />
                Écolage 4
              </label>
              <label>
                <input type="checkbox" name="ecolage5" value="Oui" onChange={handleSearch} />
                Écolage 5
              </label>
              <label>
                <input type="checkbox" name="ecolage6" value="Oui" onChange={handleSearch} />
                Écolage 6
              </label>
              <label>
                <input type="checkbox" name="ecolage7" value="Oui" onChange={handleSearch} />
                Écolage 7
              </label>
              <label>
                <input type="checkbox" name="ecolage8" value="Oui" onChange={handleSearch} />
                Écolage 8
              </label>
              <label>
                <input type="checkbox" name="ecolage9" value="Oui" onChange={handleSearch} />
                Écolage 9
              </label>
              <label>
                <input type="checkbox" name="ecolage10" value="Oui" onChange={handleSearch} />
                Écolage 10
              </label>
            </Box> */}
            <Button variant="contained" color="primary" onClick={handleFilter}>Rechercher</Button>
          </Box>
          <RegistrationList codeClasse={selectedCodeClasse} students={filteredStudents.length > 0? filteredStudents : students} />
        </Box>
      )}
    </Box>
  );
};

export default CodeClassePage; 