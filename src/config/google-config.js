const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=email profile`;
