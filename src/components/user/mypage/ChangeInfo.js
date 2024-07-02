import React, { useContext, useRef, useState } from 'react';
import styles from '../../../styles/ChangeInfo.module.scss';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { API_BASE_URL, USER } from '../../../config/host-config';
import PinDropIcon from '@mui/icons-material/PinDrop';
import axiosInstance from '../../../config/axios-config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

const { kakao } = window;
const ChangeInfo = () => {
  const navigate = useNavigate();
  const { onLogout, profileImage } = useContext(AuthContext);
  const favoriteKeywords = JSON.parse(
    localStorage.getItem('FAVORITE_KEYWORDS'),
  );
  console.log(favoriteKeywords); // (2) [{…}, {…}] temp는 배열이다.
  // temp.forEach((obj) => console.log(obj));
  // {favoriteNo: 43, favoriteKeyword: 's'}
  // {favoriteNo: 44, favoriteKeyword: 'sss'}
  // const arr = [];
  // favoriteKeywords.forEach((obj) => arr.push(obj.favoriteKeyword));
  // console.log(arr);

  const [currentKeywords, setCurrentKeywords] = useState(favoriteKeywords);
  // console.log(`currentKeywords: ${[...currentKeywords]}`);
  // console.log(`favoriteKeywords ${[...favoriteKeywords]}`);
  console.log(currentKeywords);
  console.log(currentKeywords.forEach((k) => console.log(k)));

  // console.log(`arr: ${arr}`);
  // console.log(`[...arr]: ${[...arr]}`);

  const [isCheckPw, setIsCheckPw] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState({
    password: '',
    msg: '',
    flag: false,
  });

  const currentPasswordHandler = (e) => {
    const currentPassword = e.target.value;
    let flag = false;
    let msg;

    if (!currentPassword) {
      msg = '현재 비밀번호 입력은 필수 값입니다.';
    } else {
      flag = true;

      /*
      const res = fetch(`${API_BASE_URL}${USER}/password-check`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
          localStorage.getItem('ACCESS-TOKEN'),
          inputPassword,
        ),
        */
    }
    setPasswordCheck({ password: currentPassword, flag, msg });
  };

  const sendCheckPwHandler = async () => {
    // console.log('type: ', typeof passwordCheck.password); String타입
    const res = await axiosInstance.post(
      `${API_BASE_URL}${USER}/password-check`,
      {
        password: passwordCheck.password,
      },
    );

    const status = res.status;
    const data = res.data;
    if (status === 200) {
      setIsCheckPw(true);
    } else {
      alert(data);
    }
  };

  // 내 정보 변경 페이지
  // const userNo = localStorage.getItem('USER_NO');
  // console.log(userNo);
  const [userValue, setUserValue] = useState({
    nickname1: localStorage.getItem('NICK_NAME'),
    password1: '',
    regionName1: localStorage.getItem('REGION_NAME'),
    favoriteKeywords1: localStorage.getItem('FAVORITE_KEYWORDS'),
  });
  const { nickname1, password1, regionName1, favoriteKeywords1 } = userValue;
  console.log(nickname1, password1, regionName1, favoriteKeywords1);

  const [message, setMessage] = useState({
    nickname1: '',
    password1: '',
    passwordCheck1: '',
    regionName1: '',
  });

  const [correct, setCorrect] = useState({
    nickname1: false,
    password1: false,
    passwordCheck1: false,
    regionName1: false,
  });

  const saveInputState = ({ key, inputValue, msg, flag }) => {
    console.log('values: ', { key, inputValue, msg, flag });
    inputValue !== 'pass' &&
      setUserValue((oldVal) => {
        return { ...oldVal, [key]: inputValue };
      });

    setMessage((oldMsg) => {
      return { ...oldMsg, [key]: msg };
    });

    setCorrect((oldCorrect) => {
      return { ...oldCorrect, [key]: flag };
    });
  };

  // 닉네임 변경
  const nickChangeHandler = async (e) => {
    // 2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성
    const nickRegex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
    const inputValue = e.target.value;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '닉네임은 필수값 입니다.';
    } else if (!nickRegex.test(inputValue)) {
      msg = '2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 조합해주세요';
    } else {
      // 로컬 스토리지에서 꺼내서 현재 닉네임이랑 비교해야 하는건지
      await nickFetchDuplicateCheck(inputValue);
      return;
    }

    saveInputState({
      key: 'nickname1',
      inputValue,
      msg,
      flag,
    });
  };
  // 비밀번호

  const nickFetchDuplicateCheck = async (nickname) => {
    let msg = '';
    let flag = false;

    try {
      const res = await axios.get(`${API_BASE_URL}${USER}/nick-check`, {
        params: { nickname },
      });

      const result = res.data;
      console.log(`nick중복체크 결과: ${result}`);

      if (result) {
        msg = '닉네임 중복되었습니다. 다른 닉네임을 입력해주세요.';
      } else {
        msg = '사용 가능한 닉네임 입니다.';
        flag = true;
        saveInputState({ key: 'nickname1', inputValue: nickname, msg, flag });
      }
    } catch (error) {
      msg = '중복 확인 중 오류가 발생했습니다.';
      console.error(error);
    }
  };

  const passwordHandler = (e) => {
    document.getElementById('password-check').value = '';
    setMessage({ ...message, passwordCheck: '' });
    setCorrect({ ...correct, passwordCheck: false });
    // 영문자 숫자 조합이 8자 이상
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const inputValue = e.target.value;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '비밀번호는 필수값 입니다.';
    } else if (!passwordRegex.test(inputValue)) {
      msg = '8글자 이상의 영문, 숫자를 포함해주세요.';
    } else {
      msg = '사용가능한 비밀번호 입니다.';
      flag = true;
    }

    saveInputState({ key: 'password1', inputValue, msg, flag });
  };

  const pwCheckHandler = (e) => {
    const loginPath = localStorage.getItem('LOGIN_PATH'); // 로그인 경로 가져오기
    let msg;
    let flag = false;

    // 로그인 경로가 'kakao'인 경우 비밀번호 확인 절차를 생략
    if (loginPath === 'kakao') {
      flag = true;
      msg = '카카오 로그인 사용자입니다. 비밀번호 확인이 필요 없습니다.';
    } else {
      if (!e.target.value) {
        msg = '비밀번호 확인란은 필수입니다.';
      } else if (userValue.password1 !== e.target.value) {
        msg = '입력한 비밀번호와 다릅니다.';
      } else {
        msg = '비밀번호가 일치합니다.';
        flag = true;
      }
    }

    saveInputState({
      key: 'passwordCheck1',
      inputValue: 'pass', // 실제 비밀번호 값 대신 'pass' 문자열 저장
      msg,
      flag,
    });
  };
  // 지역설정
  async function getAddr(lat, lng) {
    let geocoder = new kakao.maps.services.Geocoder();
    let coord = new kakao.maps.LatLng(lat, lng);
    let callback = await function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        // console.log(result);
        const area = result[0].address.region_1depth_name;
        console.log(area);

        saveInputState({
          key: 'regionName1',
          inputValue: area,
          msg: '지역 설정 완료',
          flag: true,
        });
      }
      //
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          //getAddr(위도, 경도);
          getAddr(position.coords.latitude, position.coords.longitude);
          console.log(position);
        },
        function (error) {
          console.error(error);
          alert('위치 조회를 차단하셨습니다! 차단 풀어주세요~');
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        },
      );
    } else {
      alert('현재 브라우저에서는 geolocation를 지원하지 않습니다');
    }
  }

  const addressClickHandler = () => {
    getLocation();
  };

  // 키워드
  const handleKeyDown = (value) => {
    console.log(value);

    for (const keyword of currentKeywords) {
      if (keyword.favoriteKeyword === value) {
        alert('이미 존재하는 키워드입니다.');
        return;
      }
    }

    setCurrentKeywords((prve) => [
      ...prve,
      {
        favoriteNo: currentKeywords[currentKeywords.length - 1].favoriteNo + 1,
        favoriteKeyword: value,
      },
    ]);

    document.getElementById('keyword').value = '';
  };

  const deleteHandler = (e) => {
    const value = e.target.textContent;
    setCurrentKeywords((prve) => {
      const updatedKeywords = prve.filter((k) => k.favoriteKeyword !== value);
      return updatedKeywords;
    });
  };

  // 프로필 이미지 등록하기
  const $fileTag = useRef(); // 인풋 요소를 참조하는데, 변경이 발생하면 showThumbnailHandler가 작동한다.

  const [imgFile, setImgFile] = useState(localStorage.getItem('PROFILE_IMAGE')); // 로그인하고, 로컬스토리지에서 얻어온 프로파일 이미지를 상태변수로 관리
  console.log('imgFile변경전: ', imgFile);
  const showThumbnailHandler = (e) => {
    console.log($fileTag);
    const file = $fileTag.current.files[0];
    console.log(`file: ${file}`);
    const fileExt = file.name.slice(file.name.indexOf('.') + 1).toLowerCase();

    if (
      fileExt !== 'jpg' &&
      fileExt !== 'png' &&
      fileExt !== 'jpeg' &&
      fileExt !== 'gif'
    ) {
      alert('이미지 파일(jpg, png, jpeg, gif)만 등록이 가능합니다.');
      console.log('$file.current.value: ', $fileTag.current.value);
      $fileTag.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log(`reader.result: ${reader.result}`);
      setImgFile(reader.result);

      console.log('$fileTag 셋한 후: ', $fileTag);
      console.log('imgFile 변경후: ', imgFile);
      console.log('$file.current.value: ', $fileTag.current.value);
    };
  };

  const isValid = () => {
    console.log('correct:', correct);
    for (let key in correct) {
      if (key === 'passwordCheck') {
        correct[key] = true;
      }
      console.log(key);
      const flag = correct[key];
      console.log(flag);
      if (!flag) return false;
    }
    return true;
  };

  const fetchUpdateMyInfoPost = async () => {
    console.log('fetchUpdateMyInfoPost 메서드 실행');
    const { nickname1, password1, regionName1, favoriteKeywords1 } = userValue;
    const userValue2 = {
      nickname1,
      password1,
      regionName1,
      favoriteKeywords1: currentKeywords,
    };

    const keywordArray = [];
    // currentKeywords.forEach((k) => keywordArray.push(k.favoriteKeyword));
    currentKeywords.forEach((k) =>
      console.log(
        `k.favoriteNo: ${k.favoriteNo} k.favoriteKeyword: ${k.favoriteKeyword}`,
      ),
    );
    // console.log(`keywordArray: ${keywordArray}`);
    // console.log(
    //   `userValue2.favoriteKeywords1: ${userValue2.favoriteKeywords1[0]}`,
    // );

    // console.log(`keywordArray: ${keywordArray}`);

    const array = [];
    for (let i = 0; i < userValue2.favoriteKeywords1.length; i++) {
      array.push(userValue2.favoriteKeywords1[i].favoriteKeyword);
    }
    // console.log('array: ', array);

    const user = {
      nickname: userValue2.nickname1,
      password: userValue2.password1,
      regionName: userValue2.regionName1,
      favoriteKeywords: array, // JSON 문자열로 전송
    };

    console.log(user);
    const userJsonBlob = new Blob([JSON.stringify(user)], {
      type: 'application/json',
    });
    console.log(userJsonBlob);

    const userFormData = new FormData();
    userFormData.append('user', userJsonBlob);
    console.log(
      '$fileTag.current.files[0] formData:',
      $fileTag.current.files[0],
    );

    console.log('imgFile:', imgFile);
    console.log('PROFILE_IMAGE: ', localStorage.getItem('PROFILE_IMAGE'));
    if (imgFile !== localStorage.getItem('PROFILE_IMAGE')) {
      userFormData.append('profileImage', $fileTag.current.files[0]);
    }

    const res = await axiosInstance.post(
      `${API_BASE_URL}${USER}/update-my-info`,
      userFormData,
    );

    if (res.status === 200) {
      alert('변경된 패스워드로 다시 로그인 해주세요');
      onLogout();
      navigate('/login');
    }

    /*
    const res = await fetch(API_BASE_URL + USER, {
      method: 'POST',
      body: userFormData,
    });

    if (res.status === 200) {
      console.log(`res: ${res}`); //----
      const data = await res.json();
      alert(`${data.email}님 회원가입에 성공했습니다.`);
      navigate('/login');
    } else {
      console.log(res.text());
      alert('서버와의 통신이 원활하지 않습니다.');
    }
      */
  };

  const updateMyInfoHandler = (e) => {
    e.preventDefault();

    if (isValid()) {
      fetchUpdateMyInfoPost();
    } else {
      alert('입력란을 다시 확인해 주세요');
    }
  };

  return (
    <>
      {isCheckPw ? (
        <>
          <div>내정보 변경</div>
          {/*<div className={content}></div>*/}
          <Grid item xs={12}>
            <div
              className='thumbnail-box'
              onClick={() => {
                $fileTag.current.click(); // 이 영역을 클릭하면 인풋창이 열린다.
              }}
            >
              <img
                src={
                  imgFile === 'null'
                    ? require('../../../assets/img/anonymous.jpg')
                    : imgFile
                }
                alt='profile'
              />

              {/* require 앞에 imgFile 변수 넣어야 함 */}
            </div>
            <label className='signup-img-label' htmlFor='profile-img'>
              프로필 이미지 추가
            </label>
            <input
              id='profile-img'
              type='file'
              style={{ display: 'none' }}
              accept='image/*'
              ref={$fileTag}
              onChange={showThumbnailHandler}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                id='email'
                label={localStorage.getItem('LOGIN_EMAIL')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='nickname1'
                label='닉네임'
                type='text'
                id='nickname1'
                autoComplete='nickname1'
                placeholder={nickname1}
                onChange={nickChangeHandler}
              />
              <span
                id='check-span'
                style={
                  correct.nickname1 ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.nickname1}
              </span>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password1'
                label='패스워드'
                placeholder='변경할 패스워드를 입력해주세요'
                autoComplete='current-password'
                onChange={passwordHandler}
              />
              <span
                id='check-span'
                style={
                  correct.password1 ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.password1}
              </span>
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password-check'
                label='패스워드 확인'
                type='password'
                id='password-check'
                autoComplete='check-password'
                onChange={pwCheckHandler}
              />
              <span
                id='check-span'
                style={
                  correct.passwordCheck1 ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.passwordCheck1}
              </span>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                id='regionName1'
                name='regionName1'
                inputProps={{ readOnly: true }}
                value={userValue.regionName1}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                type='button'
                sx={{ height: '95%' }}
                style={{ background: '#38d9a9' }}
                fullWidth
                variant='contained'
                onClick={addressClickHandler}
                startIcon={<PinDropIcon />}
              >
                내 동네 설정
              </Button>
            </Grid>
            <Grid item xs={12}>
              <h6>issue-trend가 맞춤형 뉴스를 제공합니다.</h6>
            </Grid>
            <TextField
              type='text'
              placeholder='관심 키워드를 입력하고 엔터를 누르세요'
              id='keyword'
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleKeyDown(e.target.value);
                }
              }}
            />
            <Grid item xs={12}>
              <ul style={{ display: 'flex' }}>
                {currentKeywords.map((keyword) => {
                  return (
                    <li
                      style={{ border: 'solid 1px black' }}
                      onClick={deleteHandler}
                      key={keyword.favoriteNo}
                    >
                      {keyword.favoriteKeyword}
                    </li>
                  );
                })}
              </ul>
            </Grid>
            <Grid>
              <Button
                type='button'
                fullWidth
                variant='contained'
                style={{ background: '#38d9a9', padding: '1.5%' }}
                onClick={updateMyInfoHandler}
              >
                회원정보변경하기
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <div className='password-check-page'>
            <Typography>현재 비밀번호를 입력하세요</Typography>
            <TextField
              variant='outlined'
              type='password'
              placeholder='현재 비밀번호를 입력해주세요'
              fullWidth
              required
              onBlur={currentPasswordHandler}
            ></TextField>
            <span
              style={passwordCheck.flag ? { color: 'blue' } : { color: 'red' }}
            >
              {passwordCheck.msg}
            </span>
            <Button
              type='button'
              disabled={!passwordCheck.flag}
              onClick={sendCheckPwHandler}
            >
              확인
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ChangeInfo;
