import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  console.log('RequiredAuth auth:', auth);

  return auth?.roles?.find((role) => {
    console.log('api role:', role);
    console.log('allowedRoles:', allowedRoles);
    return allowedRoles?.includes(role);
  }) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
