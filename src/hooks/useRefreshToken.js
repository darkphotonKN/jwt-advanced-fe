import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth(); // sets context auth
  const refresh = async () => {
    // get new accessToken + refreshToken pair by using old refreshToken
    const { data } = await axios.get('/api/refresh', {
      accessToken,
    });
    const { accessToken } = data;
    setAuth((prev) => {
      console.log('prev:', JSON.stringify(prev));
      return { ...prev, accessToken };
    });
  };
  return refresh;
};

export default useRefreshToken;
