import axios from '../api/axios';
import useAuth from './useAuth';
import Cookies from 'js-cookie';
import { TOKEN_VALID } from '../constants/general';

/**
 * Helps acquire a new refresh and accessToken pair by accessing
 * our global context state and retrieving the accessToken.
 * @returns A function that retrieves a new access token with the old refreshToken
 */
const useRefreshToken = () => {
  const { setAuth } = useAuth(); // sets context auth
  const refreshTokenCookie = Cookies.get('refresh'); // acquires stored refreshToken in cookies

  const refresh = async () => {
    // get new accessToken + refreshToken pair by using the retrieved old refreshToken
    console.log('[@useRefreshToken] refreshToken cookie:', refreshTokenCookie);

    const { data } = await axios.get('/api/refresh', {
      headers: {
        Authorization: refreshTokenCookie,
      },
    });
    const { accessToken } = data;

    // update token in app state to be stored in memory
    setAuth((prev) => {
      console.log('prev:', JSON.stringify(prev));
      if (accessToken) {
        // sets access token expiry in cookies
        Cookies.set(TOKEN_VALID, TOKEN_VALID, { expires: 2 });
        // set token valid duration
        console.log(
          '[@useRefreshToken] updating accessToken with:',
          accessToken
        );
        return { ...prev, accessToken };
      }
      return prev;
    });

    // return new token for immediate usage
    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
