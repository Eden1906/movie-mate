import React, { useState } from 'react';
import './css/Home.css';
import logo from '../mainLogo.png';

const Home = () => {
  const [searchBar, setSearchBar] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState(''); // המלצות מהשרת
  const [loading, setLoading] = useState(false);

  const handleMoviesAdding = () => {
    if (searchBar.trim() === '') return;
    if (movies.length >= 5) {
      alert('ניתן להוסיף עד 5 סרטים בלבד');
      return;
    }
    setMovies([...movies, searchBar.trim()]);
    setSearchBar('');
  };

  const handleSearchMovies = async () => {
    if (movies.length === 0) {
      alert('אנא הוסף לפחות סרט אחד');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movies }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecommendations(data.recommendations);
      } else {
        alert('אירעה שגיאה בחיפוש הסרטים');
      }
    } catch (error) {
      alert('שגיאה בתקשורת עם השרת');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mainLogo">
        <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
      </div>
      <button className="infoButton" onClick={() => setShowInfo(!showInfo)}>
        <ion-icon name="information-outline"></ion-icon>
      </button>
      {showInfo && (
        <div className="infoBox">
          <p>הכנס/י רשימה של סרטים ותקבל/י את הסרטים שהכי מתאימים לך</p>
          <button className="closeInfoBox" onClick={() => setShowInfo(!showInfo)}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
      )}
      <input
        className="searchBar"
        placeholder="הקלד סרט"
        type="text"
        value={searchBar}
        onChange={(e) => setSearchBar(e.target.value)}
      />
      <button className="searchButton" onClick={handleMoviesAdding}>
        הוסף סרט
      </button>
      <button className="searchButton" onClick={handleSearchMovies} disabled={loading}>
        {loading ? 'מחפש...' : 'חפש סרטים מומלצים'}
      </button>

      {movies.length > 0 && (
        <div className="centered-section">
          <h3>סרטים שהוספת:</h3>
          <ul>
            {movies.map((movie, idx) => (
              <li key={idx}>
                {idx + 1}. {movie}
              </li>
            ))}
          </ul>
        </div>
)}

    {recommendations && (
      <div className="centered-section">
        <h3>המלצות:</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{recommendations}</p>
      </div>
    )}

    </div>
  );
};

export default Home;
