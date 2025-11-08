import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Contacts from './components/Contacts';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="app-loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="*" element={
            <div className="not-found">
              <h1>404 - Page Not Found</h1>
              <a href="/">Go Home</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;