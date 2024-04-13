import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GetBooks from './GetBooks';
import ManageBook from './ManageBook';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/consultas">Consultas de libros</Link>
            </li>
            <li>
              <Link to="/gestion">Gestión de libros</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/consultas" element={<GetBooks />} />
          <Route path="/gestion" element={<ManageBook />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
