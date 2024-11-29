import { useEffect, useState, useRef } from 'react';
import axios from 'plugins/axios';

const useFetchUsers = ({ isAdmin = false } = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (hasFetched.current) return;

      setLoading(true);
      try {
        const endpoint = "/api/admin/users"
        const response = await axios.get(endpoint);
        
        setUsers(response.data.users || []);
        hasFetched.current = true;
      } catch (error) {
        if (error.response?.status === 403) {
          setError('You do not have permission to access this resource');
        } else {
          setError(error.response?.data?.message || 'Failed to fetch users');
        }
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const refetch = () => {
    hasFetched.current = false;
    setError(null);
    setUsers([]);
  };

  return { users, loading, error, refetch };
};

export default useFetchUsers;
