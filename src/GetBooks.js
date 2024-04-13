import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, List } from '@mui/material';
import './GetBooks.css';

function GetBooks() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/books?${searchType}=${searchTerm}`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBooks();
  }, [searchTerm, searchType]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
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
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card className="book-card">
              <CardContent>
                <Typography variant="h6" component="div">
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Autor: {book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Género: {book.genre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Estado: {book.condition}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Descripción: {book.conditionDescription}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default GetBooks;
