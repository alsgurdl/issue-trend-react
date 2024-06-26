import React from 'react';
import { API_BASE_URL, USER } from '../../config/host-config';
const weather = () => {
  const profileRequestURL = `${API_BASE_URL}${USER}/weather`;

  return <div>weather</div>;
};

export default weather;
