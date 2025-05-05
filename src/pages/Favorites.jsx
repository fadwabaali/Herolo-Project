import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;


export default function Favorites() {
  const { favorites, toggleFavorite } = useWeather();
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const fetchWeatherForFavorites = async () => {
      const data = {};

      await Promise.all(
        favorites.map(async (city) => {
          try {
            const res = await axios.get(
              `https://dataservice.accuweather.com/currentconditions/v1/${city.key}?apikey=${API_KEY}`
            );
            data[city.key] = res.data[0];
          } catch (error) {
            data[city.key] = null;
          }
        })
      );

      setWeatherData(data);
    };

    if (favorites.length > 0) {
      fetchWeatherForFavorites();
    }
  }, [favorites]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Favorite Cities
      </Typography>

      {favorites.length === 0 ? (
        <Typography>No favorite cities yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {favorites.map((city) => {
            const weather = weatherData[city.key];

            return (
              <Grid item xs={12} sm={6} md={3} key={city.key}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {city.name}
                      <IconButton
                        onClick={() => toggleFavorite(city)}
                        size="small"
                      >
                        <FavoriteIcon color="error" />
                      </IconButton>
                    </Typography>
                    {weather ? (
                      <>
                        <Typography>{weather.WeatherText}</Typography>
                        <Typography>
                          {weather.Temperature.Metric.Value}°C
                        </Typography>
                      </>
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
