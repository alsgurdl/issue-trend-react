import React from 'react';
import { API_BASE_URL, USER } from '../../config/host-config';
const Weather = () => {
  const profileRequestURL = `${API_BASE_URL}${USER}/weather`;
  return <div>날씨 api</div>;
};

export default Weather;
