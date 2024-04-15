import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import './GetMembers.css';

function GetMembers() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('lastname');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/members?page=${page}&size=5&sort=lastname,asc&${searchType}=${searchTerm}`);
      setMembers(prevMembers => (page === 0 ? response.data.content : [...prevMembers, ...response.data.content]));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const lastMemberElementRef = useRef(null);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setPage(0); // Reset page when search type changes
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    if (page < totalPages - 1) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, totalPages, loading]);

  useEffect(() => {
    loadMembers();
  }, [page, searchTerm, searchType]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelectedMember(null);
    setOpenDialog(false);
    setMembers([]);
    setPage(0);
    loadMembers(); // Recargar la lista de miembros después de editar
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/members/${selectedMember.id}`, selectedMember);
        alert('Miembro actualizado con éxito');
      } else {
        await axios.post('http://localhost:8080/api/members', selectedMember);
        alert('Miembro agregado con éxito');
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el miembro');
    }
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedMember(null);
  };

  const handleSubmitAddMember = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/members', selectedMember);
      alert('Miembro agregado con éxito');
      handleCloseAddDialog();
      setMembers([response.data, ...members]);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar el miembro');
    }
  };

  return (
    <Container className="get-members-container">
      <Typography variant="h4" gutterBottom>
        Consultas de Miembros
      </Typography>
      <Button variant="outlined" color="primary" onClick={() => setOpenAddDialog(true)} style={{ marginBottom: '20px' }}>
        Agregar Miembro
      </Button>
      <div className="search-container">
        <FormControl variant="outlined" className="search-form">
          <InputLabel id="search-type-label">Buscar por</InputLabel>
          <Select
            labelId="search-type-label"
            id="search-type-select"
            value={searchType}
            onChange={handleSearchTypeChange}
            label="Buscar por"
          >
            <MenuItem value="lastname">Apellido</MenuItem>
            <MenuItem value="dni">DNI</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="search-input"
        />
      </div>
      <List className="member-list">
        {members.map((member, index) => (
          <ListItem key={member.id} className="member-item" ref={index === members.length - 1 ? lastMemberElementRef : null}>
            <ListItemText
              primary={`${member.name} ${member.lastname}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary" className="member-detail">
                    DNI: {member.dni}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="member-detail">
                    Email: {member.email}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="member-detail">
                    Fecha de Nacimiento: {member.birthdate}
                  </Typography>
                </>
              }
            />
            <Button variant="outlined" color="primary" onClick={() => handleEdit(member)}>
              Editar
            </Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Miembro' : 'Agregar Miembro'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={selectedMember?.name || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              margin="normal"
              name="lastname"
              value={selectedMember?.lastname || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="DNI"
              variant="outlined"
              fullWidth
              margin="normal"
              name="dni"
              value={selectedMember?.dni || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={selectedMember?.email || ''}
              onChange={handleChange}
            />
            <TextField
              label="Fecha de Nacimiento"
              variant="outlined"
              fullWidth
              margin="normal"
              name="birthdate"
              value={selectedMember?.birthdate || ''}
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Agregar Miembro</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitAddMember}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={selectedMember?.name || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              margin="normal"
              name="lastname"
              value={selectedMember?.lastname || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="DNI"
              variant="outlined"
              fullWidth
              margin="normal"
              name="dni"
              value={selectedMember?.dni || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={selectedMember?.email || ''}
              onChange={handleChange}
            />
            <TextField
              label="Fecha de Nacimiento"
              variant="outlined"
              fullWidth
              margin="normal"
              name="birthdate"
              value={selectedMember?.birthdate || ''}
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmitAddMember} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default GetMembers;
