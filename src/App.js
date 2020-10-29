import { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';

export default function App() {
  const [position, setPosition] = useState(undefined);
  const [weatherInfo, setWeatherInfo] = useState({});
  useEffect(
    () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => setPosition(pos),
          error => {
            console.log(error);
            setPosition(null);
          },
          { timeout: 10000 }
        )
      } else {
        setPosition(null);
      }
    },
    [],
  );
  useEffect(
    () => {
      if (position) {
        const fetchWeather = async () => {
          const res = await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}`);
          setWeatherInfo({
            weather: res.data.weather[0],
            temperature: res.data.main.temp,
          });
        }
        fetchWeather();
      }
    }
    ,[position]
  )

  return (
    <>
      <div className={clsx(
        'app',
        weatherInfo.temperature < 10 && 'belowTen',
        weatherInfo.temperature > 10 && 'aboveTen',
        weatherInfo.temperature > 30 && 'aboveThirty',
      )}>
        { position === undefined && (<div>Requesting geolocation</div>) }
        { position === null && (<div>Please allow geolocation</div>) }
        { position !== undefined && weatherInfo === undefined && (<div>Loadin weather</div>) }
        { weatherInfo.weather !== undefined && (
          <img src={`https://openweathermap.org/img/w/${weatherInfo.weather.icon}.png`} alt="icon" />
        )}
      </div>
      <style jsx>{`
        .app {
          height: 200px;
          width: 100%;
          max-width: 500px;
          background-color: rgb(246, 246, 246);
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .belowTen {
          background-color: #00ffff;
        }
        .aboveTen {
          background-color: #fff700;
        }
        .aboveThirty {
          background-color: #ff8c00;
        }
      `}</style>
    </>
  );

}

