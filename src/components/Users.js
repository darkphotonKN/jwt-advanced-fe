import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthProvider';
import useAuth from '../hooks/useAuth';

import useRefreshToken from '../hooks/useRefreshToken';

const Users = () => {
  const [users, setUsers] = useState();
  const refresh = useRefreshToken();
  const authValue = useContext(AuthContext);
  console.log('AuthContext:', authValue);

  useEffect(() => {
    let isMounted = true; // indicate vituralDOM is mounted as useEffect is in effect
    const controller = new AbortController(); // from axios, used to abort ongoing requests
    const getUsers = async () => {
      try {
        const { data } = await axios.get('/users', {
          headers: { Authorization: '9' },
        });
        console.log('user data:', data);
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

      <button onClick={() => refresh()}>Test token</button>
    </article>
  );
};

export default Users;
