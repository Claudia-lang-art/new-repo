import React, { useState } from'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useNavigate } from'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminSettings from './AdminSettings';
import StudentList from './StudentList';
import PaymentList from './PaymentList';
import RegistrationList from './RegistrationList';
import VagueList from './VagueList';
import FraisList from './FraisList';
import CodeClassePage from './CodeClassePage';
import Statistique from './Statistique';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClassIcon from '@mui/icons-material/Class';

const drawerWidth = 240;
const pinkColor = '#ff69b4';
const pinkIconColor = '#E91E63'; // Couleur rose pour les icônes

const Dashboard = () => {
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showPaymentList, setShowPaymentList] = useState(false);
  const [showRegistrationList, setShowRegistrationList] = useState(false);
  const [showFraisList, setShowFraisList] = useState(false);
  const [showVagueList, setShowVagueList] = useState(false);
  const [showCodeClassePage, setShowCodeClassePage] = useState(false);
  const [showStatistique, setShowStatistique] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuth(); // Accéder à la fonction de déconnexion depuis le contexte
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeconnexion = () => {
    // Code pour gérer la déconnexion ici
    console.log('Déconnexion effectuée');
    navigate("/login");
    logout();
    setOpen(false);
  };

  const handleSectionVisibility = (section) => {
    setShowAdminSettings(section === 'AdminSettings');
    setShowStudentList(section === 'StudentList');
    setShowPaymentList(section === 'PaymentList');
    setShowRegistrationList(section === 'RegistrationList');
    setShowFraisList(section === 'FraisList');
    setShowVagueList(section === 'VagueList');
    setShowCodeClassePage(section === 'CodeClassePage');
    setShowStatistique(section === 'Statistique');
  };

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '&.MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem>
              <ListItemText primary="Espace Admin" />
            </ListItem>
            <Divider />
            <ListItem
              button
              sx={{
                bgcolor: pinkColor,
                color: 'white',
                borderRadius: '4px',
                mt: 1, mb: 1,
                width: '100%',
                mx: 'auto',
              }}
              onClick={() => handleSectionVisibility('')}
            >
              <DashboardIcon sx={{ color: 'white', mr: 1 }} />
              <ListItemText primary="Tableau de Bord" />
            </ListItem>
            <ListItem button sx={{paddingLeft:3, paddingTop:2}} onClick={() => handleSectionVisibility('AdminSettings')}>
              <SettingsIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large'}} />
              <ListItemText primary="Paramètres" />
            </ListItem>
            <ListItem button sx={{padding:3, paddingTop:1}} onClick={() => handleSectionVisibility('StudentList')}>
              <PeopleIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large' }} />
              <ListItemText primary="Étudiants" />
            </ListItem>
            <ListItem button sx={{paddingLeft:3, paddingTop:1 }} onClick={() => handleSectionVisibility('PaymentList')}>
              <MonetizationOnIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large' }} />
              <ListItemText primary="Paiements" />
            </ListItem>
            <ListItem button sx={{paddingLeft:3 }} onClick={() => handleSectionVisibility('RegistrationList')}>
              <ListAltIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large' }} />
              <ListItemText primary="Inscription" />
            </ListItem>
            <ListItem button sx={{paddingLeft:3 }} onClick={() => handleSectionVisibility('CodeClassePage')}>
              <ListAltIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large' }} />
              <ListItemText primary="Liste" />
            </ListItem>
            <ListItem button sx={{paddingLeft:3 }} onClick={() => handleSectionVisibility('FraisList')}>
              <AttachMoneyIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large' }} />
              <ListItemText primary="Frais" />
            </ListItem>
            <ListItem button sx={{paddingLeft:3 }} onClick={() => handleSectionVisibility('VagueList')}>
              <ClassIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large' }} />
              <ListItemText primary="Sections" />
            </ListItem>
            <ListItem button sx={{paddingLeft:3 }} onClick={() => handleSectionVisibility('Statistique')}>
              <ClassIcon sx={{ color: pinkIconColor, mr: 1, fontSize: 'large' }} />
              <ListItemText primary="Statistique" />
            </ListItem>
           
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3 }}
      >
        <AppBar position="sticky" sx={{ bgcolor: pinkColor }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Système de Gestion de Frais de Scolarité
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="large"
              aria-label="search"
              color="inherit"
              sx={{ color: 'white' }}
            >
              <SearchIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'white', mx: 2 }}>
              {new Date().toLocaleDateString()}
            </Typography>
            <IconButton
              size="large"
              aria-label="account"
              color="inherit"
              onClick={handleAccountClick}
            >
              <AccountCircle sx={{ color: 'white' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClickOpen}>
                <LogoutIcon sx={{ color: pinkIconColor, mr: 1 }} />
                Déconnexion
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        {showAdminSettings && <AdminSettings />}
        {showStudentList && <StudentList />}
        {showPaymentList && <PaymentList />}
        {showRegistrationList && <RegistrationList />}
        {showFraisList && <FraisList />}
        {showVagueList && <VagueList />}
        {showCodeClassePage && <CodeClassePage />}
        {showStatistique && <Statistique />}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation de déconnexion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir vous déconnecter?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Non
          </Button>
          <Button onClick={handleDeconnexion} color="primary" autoFocus>
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;