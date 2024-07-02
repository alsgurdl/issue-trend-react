import React, { useContext, useEffect } from 'react';
import { API_BASE_URL, USER } from '../../config/host-config';
import AuthContext from '../store/auth-context';
import { useNavigate } from 'react-router-dom';

const KakaoLoginHandler = () => {
  const { onLogin } = useContext(AuthContext);
  const redirection = useNavigate();
  const REQUEST_URL = API_BASE_URL + USER;

  const code = new URL(window.location.href).searchParams.get('code');
  useEffect(() => {
    const kakaoLogin = async () => {
      console.log('code: ', code);
      const res = await fetch(REQUEST_URL + '/kakaologin?code=' + code);
      const {
        token,
        email,
        loginPath,
        profileImage,
        regionName,
        nickname,
        userNo,
        favoriteKeywords,
      } = await res.json();
      onLogin(
        token,
        email,
        loginPath,
        profileImage,
        regionName,
        nickname,
        userNo,
        favoriteKeywords,
      );
      redirection('/home');
    };

    kakaoLogin();
  }, []);

  return <div>KakaoLoginHandler</div>;
};

export default KakaoLoginHandler;
