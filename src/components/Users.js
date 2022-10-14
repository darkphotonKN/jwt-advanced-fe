import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import useAuth from '../hooks/useAuth';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useRefreshToken from '../hooks/useRefreshToken';

const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState();
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth, setAuth } = useContext(AuthContext);

  console.log('AuthContext State:', auth);

  useEffect(() => {
    let isMounted = true; // indicate vituralDOM is mounted as useEffect is in effect
    const controller = new AbortController(); // from axios, used to abort ongoing requests

    const getUsers = async () => {
      try {
        console.log(`%c[@apiHelper] !%TWO%! GET INSTANCE call`, 'color: aqua');
        const { data } = await axiosPrivate.get('/users', {
          signal: controller.signal,
        });

        console.log('[@USERS API RESPONSE] user data:', data);
        setUsers(data);
      } catch (err) {
        console.log('err:', err);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>

      <ul style={{ margin: '20px 0' }}>
        {users?.map((user, index) => (
          <li key={index} style={{ listStyle: 'none' }}>
            {user?.username}
          </li>
        ))}
      </ul>

      <button onClick={() => setAuth((prev) => ({ ...prev, accessToken: '' }))}>
        Clear accessToken
      </button>
      <button onClick={() => refresh()}>Test token</button>
    </article>
  );
};

export default Users;
