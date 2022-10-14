import { useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const AuthLayout = ({ children }) => {
  const { auth } = useContext(AuthContext);
  console.log('[@AuthLayout accessToken', auth);

  // setup
  useEffect(() => {
    console.log(
      '[@AuthLayout useEffect] accessToken changed re-rendering children'
    );
    let isMounted = true;
    const controller = new AbortController();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth?.accessToken]);

  // private private axios instance to child components
  return <span>{children}</span>;
};

export default AuthLayout;
