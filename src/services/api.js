import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Assurez-vous que cela correspond au port de votre backend

// Authentification
export const registerUser = (userData) => axios.post(`${API_BASE_URL}/register`, userData);
export const loginUser = (credentials) => axios.post(`${API_BASE_URL}/login`, credentials);

// Utilisateurs
export const getUsers = () => axios.get(`${API_BASE_URL}/users`);
export const updateUser = (id, userData) => axios.put(`${API_BASE_URL}/users/${id}`, userData);
export const deleteUser = (id) => axios.delete(`${API_BASE_URL}/users/${id}`);

// Étudiants
export const addStudent = (studentData) => axios.post(`${API_BASE_URL}/api/students`, studentData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  export const updateStudent = (id, studentData) => axios.put(`${API_BASE_URL}/api/students/${id}`, studentData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
export const getStudents = () => axios.get(`${API_BASE_URL}/students`);

export const deleteStudent = (id) => axios.delete(`${API_BASE_URL}/students/${id}`);

// Paiements
export const getPayments = () => axios.get(`${API_BASE_URL}/payments`);
export const createPayment = (paymentData) => axios.post(`${API_BASE_URL}/payments`, paymentData);
export const updatePayment = (id, paymentData) => axios.put(`${API_BASE_URL}/payments/${id}`, paymentData);
export const deletePayment = (id) => axios.delete(`${API_BASE_URL}/payments/${id}`);

// Inscriptions
export const getRegistrations = () => axios.get(`${API_BASE_URL}/registrations`);
export const createRegistration = (registrationData) => axios.post(`${API_BASE_URL}/registrations`, registrationData);
export const updateRegistration = (id, registrationData) => axios.put(`${API_BASE_URL}/registrations/${id}`, registrationData);
export const deleteRegistration = (id) => axios.delete(`${API_BASE_URL}/registrations/${id}`);

// Classes
export const getClasses = () => axios.get(`${API_BASE_URL}/classes`);
export const createClassesClass = (classData) => axios.post(`${API_BASE_URL}/classes`, classData);
export const updateClasses = (id, classData) => axios.put(`${API_BASE_URL}/classes/${id}`, classData);
export const deleteClasses = (id) => axios.delete(`${API_BASE_URL}/classes/${id}`);

// Frais
export const getFrais = () => axios.get(`${API_BASE_URL}/frais`);
export const addFrais = (fraisData) => axios.post(`${API_BASE_URL}/frais`, fraisData);
export const updateFrais = (id, fraisData) => axios.put(`${API_BASE_URL}/frais/${id}`, fraisData);
export const deleteFrais = (id) => axios.delete(`${API_BASE_URL}/frais/${id}`);

// Options
export const getOptions = () => axios.get(`${API_BASE_URL}/options`);
export const addOption = (optionData) => axios.post(`${API_BASE_URL}/options`, optionData);
export const updateOption = (id, optionData) => axios.put(`${API_BASE_URL}/options/${id}`, optionData);
export const deleteOption = (id) => axios.delete(`${API_BASE_URL}/options/${id}`);

// Sections
export const getSections = () => axios.get(`${API_BASE_URL}/sections`);
export const addSection = (sectionData) => axios.post(`${API_BASE_URL}/sections`, sectionData);
export const updateSection = (id, sectionData) => axios.put(`${API_BASE_URL}/sections/${id}`, sectionData);
export const deleteSection = (id) => axios.delete(`${API_BASE_URL}/sections/${id}`);
