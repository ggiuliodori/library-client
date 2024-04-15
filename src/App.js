import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GetBooks from './GetBooks';
import ManageBook from './ManageBook';
import GetMembers from './GetMembers';
import './App.css';

function Home() {
  return (
    <div className="home-container">
      <img src="/images/library.jpg" alt="Librería" className="library-image" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul className="nav-list">
              <li>
                <Link to="/buscar" className="nav-button">Buscar</Link>
              </li>
              <li>
                <Link to="/gestion/agregar" className="nav-button">Agregar Libro</Link>
              </li>
              <li>
                <Link to="/miembros" className="nav-button">Miembros</Link>
              </li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<GetBooks />} />
          <Route path="/gestion/agregar" element={<ManageBook />} />
          <Route path="/miembros" element={<GetMembers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
