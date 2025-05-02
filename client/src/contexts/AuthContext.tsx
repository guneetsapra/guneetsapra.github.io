import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  logOut, 
  subscribeToAuthChanges 
} from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

// Create context types
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: () => Promise<User | undefined>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  createUserWithEmail: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => undefined,
  loginWithEmail: async () => {
    throw new Error('Not implemented');
  },
  createUserWithEmail: async () => {
    throw new Error('Not implemented');
  },
  logout: async () => {},
});

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes when the component mounts
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  // Login with Google
  const login = async () => {
    try {
      return await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Login with email/password
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  };

  // Create user with email/password
  const createUserWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Email signup failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Create the value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    login,
    loginWithEmail,
    createUserWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the auth context
export const useAuth = () => useContext(AuthContext);