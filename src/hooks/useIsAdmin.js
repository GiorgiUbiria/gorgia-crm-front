import { useMemo } from 'react';

const useIsAdmin = () => {
  const isAdmin = useMemo(() => {
    try {
      const authUserString = sessionStorage.getItem('authUser');
      if (!authUserString) return false;
      
      const authUser = JSON.parse(authUserString);
      return authUser?.type === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }, []);

  return isAdmin;
};

export default useIsAdmin; 