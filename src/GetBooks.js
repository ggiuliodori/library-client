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
import './GetBooks.css';

function GetBooks() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/books?page=${page}&size=5&sort=title,asc&${searchType}=${searchTerm}`);
      if (page === 0) {
        setBooks(response.data.content);
      } else {
        setBooks(prevBooks => [...prevBooks, ...response.data.content]);
      }
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const lastBookElementRef = useRef(null);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setPage(0); // Reset page when search type changes
  };

  const handleScroll = (entries) => {
    const lastEntry = entries[0];
    if (lastEntry.isIntersecting && !loading && page < totalPages - 1) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    const observer = new IntersectionObserver(handleScroll, options);

    if (lastBookElementRef.current) {
      observer.observe(lastBookElementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [page, totalPages, loading]);

  useEffect(() => {
    loadBooks();
  }, [page, searchTerm, searchType]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelectedBook(null);
    setOpenDialog(false);
    setBooks([]);
    setPage(0);
    loadBooks(); // Recargar la lista de libros después de editar
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/books/${selectedBook.id}`, selectedBook);
        alert('Libro actualizado con éxito');
      } else {
        await axios.post('http://localhost:8080/api/books', selectedBook);
        alert('Libro agregado con éxito');
      }
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el libro');
    }
  };

  return (
    <Container className="get-books-container">
      <Typography variant="h4" gutterBottom>
        Consultas de Libros
      </Typography>
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
            <MenuItem value="title">Título</MenuItem>
            <MenuItem value="genre">Género</MenuItem>
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
      <List className="book-list">
        {books.map((book, index) => (
          <ListItem key={book.id} className="book-item" ref={index === books.length - 1 ? lastBookElementRef : null}>
            <ListItemText
              primary={book.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary" className="book-detail">
                    Autor: {book.author}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="book-detail">
                    Editorial: {book.editorial}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="book-detail">
                    Fecha de Publicación: {book.publicationDate}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="book-detail">
                    Género: {book.genre}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="book-detail">
                    Resumen: {book.resume}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="book-detail">
                    Estado: {book.condition}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="book-detail">
                    Descripción del Estado: {book.conditionDescription}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary" className="book-detail">
                    Nomenclatura: {book.nomenclature}
                  </Typography>
                </>
              }
            />
            <Button variant="outlined" color="primary" onClick={() => handleEdit(book)}>
              Editar
            </Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Libro' : 'Agregar Libro'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nomenclatura"
              variant="outlined"
              fullWidth
              margin="normal"
              name="nomenclature"
              value={selectedBook?.nomenclature || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              margin="normal"
              name="title"
              value={selectedBook?.title || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Autor"
              variant="outlined"
              fullWidth
              margin="normal"
              name="author"
              value={selectedBook?.author || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Editorial"
              variant="outlined"
              fullWidth
              margin="normal"
              name="editorial"
              value={selectedBook?.editorial || ''}
              onChange={handleChange}
            />
            <TextField
              label="Género"
              variant="outlined"
              fullWidth
              margin="normal"
              name="genre"
              value={selectedBook?.genre || ''}
              onChange={handleChange}
            />
            <TextField
              label="Fecha de Publicación"
              variant="outlined"
              fullWidth
              margin="normal"
              name="publicationDate"
              value={selectedBook?.publicationDate || ''}
              onChange={handleChange}
            />
            <TextField
              label="Resumen"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              name="resume"
              value={selectedBook?.resume || ''}
              onChange={handleChange}
            />
            <TextField
              label="Estado"
              variant="outlined"
              fullWidth
              margin="normal"
              name="condition"
              value={selectedBook?.condition || ''}
              onChange={handleChange}
            />
            <TextField
              label="Descripción del Estado"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              name="conditionDescription"
              value={selectedBook?.conditionDescription || ''}
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
    </Container>
  );
}

export default GetBooks;
