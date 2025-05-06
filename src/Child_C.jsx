import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');
const apikey = '5be6aa238b194a7e882123428250305';

const fetchdata = async query => {
  try {
    const result = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${query}`,
    );
    return result.data;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
};

const fetchCitySuggestions = async query => {
  try {
    const result = await axios.get(
      `https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${query}`,
    );
    return result.data;
  } catch (error) {
    console.log(`Suggestion fetch error: ${error}`);
    return [];
  }
};

const fetchforcast = async city => {
  try {
    const result = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&days=7&aqi=no&alerts=no`,
    );
    return result.data;
  } catch (error) {
    console.log(`Error in Forecasting is : ${error}`);
  }
};

const storeDataToAsyncStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(`Error saving the asyncstorage ${key}: ${error}`);
  }
};

const getasyncstorageData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('city');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log(`Error displaying the asyncstorage city: ${error}`);
  }
};

const Child_C = () => {
  const [showsearchbar, setshowsearchbar] = useState(false);
  const [weather, setweather] = useState(null);
  const [city, setcity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dropdown, setdropdown] = useState(null); // forecast only

  const showweather = async city => {
    const data = await fetchdata(city);
    const forecast = await fetchforcast(city);
    if (data && forecast) {
      setweather(data);
      setdropdown(forecast.forecast); // Only the forecast part
      setcity(city);
      storeDataToAsyncStorage('weatherData', data);
      storeDataToAsyncStorage('forecastData', forecast); // Full object
      storeDataToAsyncStorage('city', city);
    }
  };

  useEffect(() => {
    const fetchasynccity = async () => {
      const savedcity = await getasyncstorageData();
      const savedweather = await AsyncStorage.getItem('weatherData');
      const savedforecast = await AsyncStorage.getItem('forecastData');

      if (savedcity && savedweather) {
        setcity(savedcity);
        try {
          const parsedWeather = JSON.parse(savedweather);
          setweather(parsedWeather);
        } catch (e) {
          console.log('Error parsing weatherData:', e);
        }

        if (savedforecast) {
          try {
            const parsedforecast = JSON.parse(savedforecast);
            setdropdown(parsedforecast?.forecast); // Only set forecast part
          } catch (error) {
            console.log(`Error parsing forecast: ${error}`);
          }
        }
      }
    };

    fetchasynccity();
  }, []);

  const handleSearchIconPress = () => {
    if (!showsearchbar) {
      setshowsearchbar(true);
      setcity('');
      setSuggestions([]);
    } else if (city.trim()) {
      showweather(city);
      setshowsearchbar(false);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (city.length > 0) {
        fetchCitySuggestions(city).then(data => {
          setSuggestions(data);
        });
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [city]);

  const array = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const currentindexday = new Date(weather?.location?.localtime).getDay();

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchbar_view}>
        <View style={styles.searchbar}>
          {showsearchbar && (
            <TextInput
              placeholder="Search any city"
              placeholderTextColor="black"
              style={[styles.input]}
              value={city}
              onChangeText={setcity}
            />
          )}
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={handleSearchIconPress}>
            <MagnifyingGlassIcon size={25} color="white" />
          </TouchableOpacity>
        </View>

        {showsearchbar && (
          <View style={styles.dropdown_view}>
            <ScrollView style={{maxHeight: 200}}>
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setcity(item.name);
                    setSuggestions([]);
                    showweather(item.name);
                    setshowsearchbar(false);
                  }}>
                  <Text style={styles.dropdown_text}>
                    {item.name}, {item.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* City and Country */}
      <View style={styles.location}>
        <Text style={styles.location_city}>
          {weather ? weather.location.name : 'Not found'}
        </Text>
        <Text style={styles.location_country}>
          {weather ? weather.location.country : 'Not found'}
        </Text>
      </View>

      {/* Weather Animation */}
      <View style={styles.lottieanimation}>
        <Image
          source={{uri: `https:${weather?.current?.condition?.icon}`}}
          style={{width: 100, height: 100}}
        />
      </View>

      {/* Temperature */}
      <View style={styles.temperature}>
        <Text style={styles.temperature_text}>
          {weather?.current?.temp_c}°C
        </Text>
        <Text
          style={[
            styles.conditon,
            {fontWeight: 'bold', color: 'rgba(129, 225, 171, 0.9)'},
          ]}>
          {array[currentindexday]}
        </Text>
        <Text style={styles.conditon}>
          {weather?.current?.condition?.text}
        </Text>
      </View>

      {/* Pressure , Saturation, Time */}
      <View style={styles.features}>
        <Text style={styles.features_text}>
          💨{weather?.current?.wind_kph}Km
        </Text>
        <Text style={styles.features_text}>
          💧{weather?.current?.humidity}%
        </Text>
        <Text style={styles.features_text}>
          {(() => {
            const time24 = weather?.location?.localtime?.split(' ')[1];
            if (!time24) return '';
            const [hour, minute] = time24.split(':');
            const h = parseInt(hour, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const hour12 = h % 12 || 12;
            return `${hour12}:${minute} ${ampm}`;
          })()}
        </Text>
      </View>

      {/* 7 Days Temperature */}
      <View style={styles.dailyforcast_view}>
        <Text style={styles.dailyforcast_view_text}>Daily Forecast 🗓️</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dropdown?.forecastday?.slice(1).map((item, idx) => {
          const date = new Date(item.date);
          const dayname = array[date.getDay()];
          return (
            <View
              style={[styles.days, idx === 0 && {marginLeft: height * 0.034}]}
              key={idx}>
              <Image
                source={{uri: `https:${item.day.condition.icon}`}}
                style={{height: 50, width: 50, borderRadius: 20}}
              />
              <Text>{dayname}</Text>
              <Text>{item.day.avgtemp_c}°C</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  searchbar_view: {
    height: '7%',
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    zIndex: 50,
    marginBottom: height * 0.05,
  },
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    paddingLeft: 24,
    height: 40,
    paddingBottom: 10,
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 9999,
    padding: 12,
  },
  location: {
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  location_city: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgba(55, 253, 243, 0.45)',
  },
  location_country: {
    color: 'white',
    fontFamily: 'serif',
    fontSize: 20,
    marginTop: 5,
  },
  lottieanimation: {
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  temperature: {
    alignItems: 'center',
  },
  temperature_text: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  conditon: {
    color: 'lightgray',
    fontSize: 18,
  },
  features: {
    flexDirection: 'row',
    marginTop: height * 0.05,
  },
  features_text: {
    marginHorizontal: width * 0.07,
    color: 'lightblack',
    fontSize: 20,
  },
  dailyforcast_view: {
    left: width * -0.26,
    marginTop: height * 0.03,
  },
  dailyforcast_view_text: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  days: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 15,
    padding: 15,
    marginTop: height * 0.02,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  dropdown_view: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  dropdown_text: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
});

export default Child_C;
