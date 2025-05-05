import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Weather from './pages/Weather';
import { WeatherProvider } from './context/WeatherContext';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';
function App() {
  return (
    <>
    <WeatherProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Weather />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </WeatherProvider>
    </>
  );
}

export default App;
