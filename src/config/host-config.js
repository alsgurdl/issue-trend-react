const clientHostName = window.location.hostname;

let backEndHostName;

if (clientHostName === 'localhost') {
  backEndHostName = 'http://localhost:8181';
} else if (clientHostName === 'spring.com') {
  backEndHostName = 'https://api.spring.com';
}

export const API_BASE_URL = backEndHostName;
export const USER = '/issue-trend';
