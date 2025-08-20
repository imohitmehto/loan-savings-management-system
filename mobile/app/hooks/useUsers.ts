import { useEffect, useState } from 'react';
import { getUsers } from '../services/api/userService';
import { User } from '../types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
};
