import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button, Container, Toolbar, Box } from '@mui/material';
import GetBooks from './GetBooks';
import ManageBook from './ManageBook';

function App() {
  return (
    <Router>
      <Container>
        <Toolbar>
          <Box sx={{ mr: 2 }}>
            <Button 
              component={Link} 
              to="/consultas" 
              color="primary" 
              variant="contained"
              sx={{ boxShadow: 2, borderRadius: 2 }}
            >
              Consultas de libros
            </Button>
          </Box>
          <Box sx={{ mr: 2 }}>
            <Button 
              component={Link} 
              to="/gestion" 
              color="primary" 
              variant="contained"
              sx={{ boxShadow: 2, borderRadius: 2 }}
            >
              Gestión de libros
            </Button>
          </Box>
        </Toolbar>
        <Routes>
          <Route path="/consultas" element={<GetBooks />} />
          <Route path="/gestion" element={<ManageBook />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
