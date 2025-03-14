import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CollectionsIcon from '@mui/icons-material/Collections';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketDetail from './components/TicketDetail';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <CollectionsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tocket - Your Ticket Storage
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
        <Routes>
          <Route path="/" element={<TicketList />} />
          <Route path="/add" element={<TicketForm />} />
          <Route path="/edit/:id" element={<TicketForm />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
        </Routes>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            Tocket - Store Your Tickets &copy; {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App; 