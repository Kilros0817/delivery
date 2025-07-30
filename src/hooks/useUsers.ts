import { useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: string) => User[];
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<User[]> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/users');
      // if (!response.ok) {
      //   throw new Error('Failed to fetch users');
      // }
      // return await response.json();
      
      // For now, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockUsers;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch users');
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    await loadUsers();
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: string): User[] => {
    return users.filter(user => user.role === role);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refreshUsers,
    getUserById,
    getUsersByRole
  };
};