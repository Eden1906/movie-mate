import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home.js'


function App() {
  return (
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<Home />} /> {/* עמוד הבית */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
