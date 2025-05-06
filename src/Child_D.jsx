import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';

const apikey = '5be6aa238b194a7e882123428250305';

const fetchdata = async city => {
  try {
    const result = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}&aqi=yes`,
    );
    return result.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

const Child_D = () => {
  const [weather, setWeather] = useState(null);

  const showweather = async () => {
    const data = await fetchdata('Dubai');
    if (data) {
      setWeather(data);
    }
  };

  useEffect(() => {
    showweather(); // Call on mount, or remove this if you only want it on button press
  }, []);

  return (
    <View>
      <Text>
        {weather
          ? `City: ${weather.location.name}\nTemp: ${weather.current.temp_c}°C`
          : 'Loading...'}
      </Text>
    </View>
  );
};

export default Child_D;
