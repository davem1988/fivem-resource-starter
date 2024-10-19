'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

// Add this type definition
type DbUser = {
  username?: string;
  email?: string;
  projects?: any[];
};

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);

  useEffect(() => {
    if (isLoaded && userId && user) {
      fetch(`/api/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.user) {
            setDbUser(data.user);
          } else {
            // If user doesn't exist in our database, create a new one
            createUser();
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [isLoaded, userId, user]);

  const createUser = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: userId,
          email: user?.primaryEmailAddress?.emailAddress ?? '',
          username: user?.username || `${user?.firstName ?? ''}${user?.lastName ?? ''}`,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setDbUser(data.data);
      } else {
        console.error('Failed to create user:', data.message);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (!isLoaded || !userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-window">
      <h1>Dashboard</h1>
      {dbUser ? (
        <div>
          <p>Welcome, {dbUser?.username || 'User'}!</p>
          <p>Email: {dbUser?.email || 'Not available'}</p>
          <p>Projects: {dbUser?.projects?.length || 0}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
