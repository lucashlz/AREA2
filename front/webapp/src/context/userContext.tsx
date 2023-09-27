import { createContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

export interface IUserContext {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  getUserInfo: () => Promise<{username: string, email: string, password: string}>;
  token: string | null;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));


  const signUp = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/register', { email, password });
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        setToken(response.data.token);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  }



  const signIn = async (email: string, password: string) => {
    console.log(`Attempting to sign in user with email: ${email}`);

    try {
      const response = await axios.post('http://localhost:8080/auth/sign_in', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Received response from API:', response.data);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        setToken(response.data.token);
        console.log('User successfully signed up and token saved.');
      } else {
        console.log('No token received in response.');
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }

  const signOut = () => {
    localStorage.removeItem('userToken');
    setToken(null);
  };


  const getUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{signUp, signIn, signOut, token, getUserInfo}}>
      {children}
    </UserContext.Provider>
  )
}
