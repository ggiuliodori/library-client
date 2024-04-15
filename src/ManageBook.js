import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container } from '@mui/material';
import './ManageBooks.css';

function ManageBooks() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    editorial: '',
    publicationDate: '',
    genre: '',
    resume: '',
    condition: '',
    conditionDescription: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/books', book);
      alert('Libro agregado con éxito');
      setBook({
        title: '',
        author: '',
        editorial: '',
        publicationDate: '',
        genre: '',
        resume: '',
        condition: '',
        conditionDescription: '',
      });
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error al agregar el libro');
    }
  };

  return (
    <Container className="manage-books-container">
      <h2>Gestión de Libros</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <TextField
          label="Título"
          variant="outlined"
          name="title"
          value={book.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required // Mantenemos el atributo required para el título
        />
        <TextField
          label="Autor"
          variant="outlined"
          name="author"
          value={book.author}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required // Mantenemos el atributo required para el autor
        />
        <TextField
          label="Editorial"
          variant="outlined"
          name="editorial"
          value={book.editorial}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Publicación (año)"
          variant="outlined"
          name="publicationDate"
          value={book.publicationDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Género"
          variant="outlined"
          name="genre"
          value={book.genre}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Resumen"
          variant="outlined"
          name="resume"
          value={book.resume}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Estado"
          variant="outlined"
          name="condition"
          value={book.condition}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción del Estado"
          variant="outlined"
          name="conditionDescription"
          value={book.conditionDescription}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
      </form>
    </Container>
  );
}

export default ManageBooks;
