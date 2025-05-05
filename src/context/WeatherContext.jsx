import { createContext, useState, useContext } from 'react';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  );

  const toggleFavorite = (location) => {
    const exists = favorites.some((fav) => fav.id === location.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== location.id)
      : [...favorites, location];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <WeatherContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
