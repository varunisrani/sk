import { useUserChurches } from '@/hooks/useChurch';

export const useIsStaff = () => {
  const { data: userChurches } = useUserChurches();
  const role = userChurches?.[0]?.role as string | undefined;
  return role === 'admin' || role === 'pastor' || role === 'staff';
};
