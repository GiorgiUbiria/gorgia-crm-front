import { useEffect, useState, useRef } from 'react';
import axios from 'plugins/axios'; // Adjust to your axios instance

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const hasFetched = useRef(false); // Track if fetching has already been done

  useEffect(() => {
    const fetchUsers = async () => {
      if (hasFetched.current) return; // If already fetched, do nothing

      setLoading(true);
      try {
        const response = await axios.get('/api/admin/users');
        console.log(response);
        
        setUsers(response.data.users);
        hasFetched.current = true; // Mark as fetched to prevent future calls
      } catch (error) {
        setError(error.response ? error.response.data : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // Trigger the API call
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;
