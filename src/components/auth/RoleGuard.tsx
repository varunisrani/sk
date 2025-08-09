import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsStaff } from '@/hooks/useRoles';

interface RoleGuardProps {
  requireStaff?: boolean;
  children: ReactNode;
}

const RoleGuard = ({ requireStaff = false, children }: RoleGuardProps) => {
  const isStaff = useIsStaff();
  if (requireStaff && !isStaff) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default RoleGuard;
