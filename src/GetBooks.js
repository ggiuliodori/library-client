import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import './GetBooks.css';

function GetBooks() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

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
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <ListItem key={book.id} className="book-item" ref={lastBookElementRef}>
                <ListItemText
                  primary={book.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary" className="book-author">
                        Autor: {book.author}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary" className="book-genre">
                        Género: {book.genre}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary" className="book-condition">
                        Estado: {book.condition}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary" className="book-conditionDescription">
                        Descripción: {book.conditionDescription}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          } else {
            return (
              <ListItem key={book.id} className="book-item">
                <ListItemText
                  primary={book.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary" className="book-author">
                        Autor: {book.author}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary" className="book-genre">
                        Género: {book.genre}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary" className="book-condition">
                        Estado: {book.condition}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary" className="book-conditionDescription">
                        Descripción: {book.conditionDescription}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          }
        })}
      </List>
      {loading && <Typography variant="body1" align="center">Cargando...</Typography>}
    </Container>
  );
}

export default GetBooks;
