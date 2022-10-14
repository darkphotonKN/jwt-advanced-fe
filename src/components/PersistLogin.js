import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  // function that enables us to acquire new accessToken via refreshToken
  const refresh = useRefreshToken();
  // auth state from context
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log('err while persisting login:', err);
      } finally {
        // stop loading regardless of the above result
        setIsLoading(false);
      }
    };

    // only run this when we DONT have an accessToken
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  // testing what happens when isLoading state changes
  useEffect(() => {
    console.log(`[@isLoading] isLoading: ${isLoading}`);
    console.log(`[@isLoading] accessToken: ${auth?.accessToken}`);
  }, [isLoading]);

  // outlet is where the children of the current router should render
  return <>{isLoading ? <div>Loading</div> : <Outlet />}</>;
};

export default PersistLogin;
