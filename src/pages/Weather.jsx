import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { useWeather } from '../context/WeatherContext';
  import FavoriteIcon from '@mui/icons-material/Favorite';
  import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
  
  const API_KEY = import.meta.env.VITE_API_KEY;

  
  const DEFAULT_CITY = {
    name: ' Casablanca',
    key: '123225', 
  };
  
  export default function Weather() {
    const [query, setQuery] = useState('');
    const [city, setCity] = useState(DEFAULT_CITY);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const { favorites, toggleFavorite } = useWeather();
  
    const isFavorite = favorites.some((f) => f.key === city.key);
  
    const handleSearch = async () => {
      if (!/^[a-zA-Z\s]+$/.test(query)) {
        alert('Search must be in English letters only');
        return;
      }
  
      try {
        const res = await axios.get(
          `https://dataservice.accuweather.com/locations/v1/cities/autocomplete`,
          {
            params: {
              apikey: API_KEY,
              q: query,
            },
          }
        );
  
        if (res.data.length > 0) {
          const match = res.data[0];
          setCity({ name: match.LocalizedName, key: match.Key });
        } else {
          alert('City not found');
        }
      } catch (err) {
        alert('Failed to search city');
      }
    };
  
    const fetchWeather = async () => {
      try {
        const [current, forecastRes] = await Promise.all([
          axios.get(
            `https://dataservice.accuweather.com/currentconditions/v1/${city.key}?apikey=${API_KEY}`
          ),
          axios.get(
            `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${city.key}?apikey=${API_KEY}&metric=true`
          ),
        ]);
  
        setWeather(current.data[0]);
        setForecast(forecastRes.data.DailyForecasts);
      } catch (error) {
        alert('Failed to load weather data');
      }
    };
  
    useEffect(() => {
      fetchWeather();
    }, [city]);
  
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Weather in {city.name}
          <IconButton onClick={() => toggleFavorite(city)} sx={{ ml: 1 }}>
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Typography>
  
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Search city"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
  
        {weather && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6">Current Weather</Typography>
              <Typography>
                {weather.WeatherText}, {weather.Temperature.Metric.Value}°C
              </Typography>
            </CardContent>
          </Card>
        )}
  
        <Typography variant="h6" gutterBottom>
          5-Day Forecast
        </Typography>
        <Grid container spacing={2}>
          {forecast.map((day) => (
            <Grid item xs={12} sm={6} md={2.4} key={day.Date}>
              <Card>
                <CardContent>
                  <Typography variant="body2">
                    {new Date(day.Date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    {day.Day.IconPhrase}
                  </Typography>
                  <Typography variant="body2">
                    {day.Temperature.Minimum.Value}°C -{' '}
                    {day.Temperature.Maximum.Value}°C
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  