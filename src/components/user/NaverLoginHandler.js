import { useContext, useEffect } from 'react';
import { API_BASE_URL, USER } from '../../config/host-config';
import AuthContext from '../../../util/AuthContext';
import { useNavigate } from 'react-router-dom';

const NaverLoginHandler = () => {
  console.log(
    '사용자가 동의화면을 통해 필수 정보 동의 후 naver인증 서버에서 redirect를 진행함!',
  );

  const { onLogin } = useContext(AuthContext);
  const redirection = useNavigate();
  const storedState = sessionStorage.getItem('naver_state'); // 세션 스토리지에서 저장된 state 값 가져오기

  const REQUEST_URL = API_BASE_URL + USER;

  // URL에 쿼리스트링으로 전달된 인가 코드를 얻어오는 방법.
  const code = new URL(window.location.href).searchParams.get('code');
  const state = new URL(window.location.href).searchParams.get('state');

  console.log('code: ', code);
  console.log('state: ', state);

  useEffect(() => {
    // 컴포넌트가 렌더링될 때 인가 코드를 백엔드로 전송하는 fetch 요청
    const naverLogin = async () => {
      const res = await fetch(
        `${REQUEST_URL}/naverLogin?code=${code}&state=${state}`,
      );
      const {
        token,
        email,
        loginPath,
        profileImage,
        regionName,
        nickname,
        userNo,
        favoriteKeywords,
      } = await res.json(); // 서버에서 온 json 읽기

      // Context API를 사용하여 로그인 상태를 업데이트 합니다.
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

      // 조건에 따라 리다이렉트
      redirection('/home');
    };

    naverLogin();
  }, []);

  return <div>NaverLoginHandler</div>;
};

export default NaverLoginHandler;
