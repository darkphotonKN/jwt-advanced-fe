import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

const Users = React.lazy(() => import('./Users'));

const Admin = () => {
  return (
    <section>
      <h1>Admins Page</h1>
      <br />
      <Suspense fallback={<div>LOADING</div>}>
        <Users />
      </Suspense>
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

export default Admin;
