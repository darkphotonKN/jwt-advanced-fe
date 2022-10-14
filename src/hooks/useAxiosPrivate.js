import { useEffect } from 'react';

import axios, { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken(); // refresh function to acquire new access/refresh token with old refresh token
  const { auth } = useAuth(); // auth from context api, including accessToken set login or refresh
  console.log('auth context:', auth);

  useEffect(() => {
    console.log('[@useAxiosPrivate useEffect] initialization');
    // prevents the need of attaching the app state's accessToken
    // to every private request
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        console.log(`[@useAxiosPrivate useEffect] config ${config}`);

        // if there is no authorization headers it means this is the first attempt
        if (!config.headers['Authorization']) {
          console.log(
            '[@REQUEST INTERCEPTOR] adding accessToken:',
            auth.accessToken
          );
          // we use the accessToken from memory (app state) and append it to the request's header
          config.headers['Authorization'] = auth.accessToken;
        }
        return config;
      },

      (error) => Promise.reject(error) // handle any other error with a rejection
    );

    // if everything fails, it ends up in the response where we handle it with an interceptor
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        // no errors caught, allow response to go through

        return response;
      },

      async (error) => {
        // handle 403 errors
        const prevRequest = error?.config; // accessing the previous request (the one that had an error and entered this callback)
        console.log(
          `%c[@useAxiosPrivate] !%ONE%! DOES RUN REQUEST INTERCEPTOR request. 
        config.HEADERS: ${error?.config}
        `,
          'color: aqua'
        );
        console.log(
          'accessToken prevRequest.sent:',
          prevRequest?.sent,
          '\nerror.response.status:',
          error?.response?.status
        );
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          // prevent infinite loop by setting sent status to true
          prevRequest.sent = true;
          // acquire new accessToken with refresh token stored in http-only cookie
          const newAccessToken = await refresh();
          console.log(
            `[@RESPONSE INTERCEPTOR] response error, adding obtained new accessToken: ${newAccessToken}\nwith refreshToken and retrying request`
          );
          prevRequest.headers['Authorization'] = newAccessToken;
          // retry axios request with newly obtained accessToken
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error); // handle any other error with a rejection
      }
    );

    // remove the interceptors on clean up
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
