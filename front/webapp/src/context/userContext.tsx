import { createContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

export interface IUserContext {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => void;
  getUserInfo: () => Promise<{username: string, email: string, password: string}>;
  updateInfo: (email: string, username: string, oldPassword: string, newPassword: string) => Promise<any>;
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


  const signIn = async (email: string, password: string): Promise<any> => {
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
        console.log('User successfully signed in and token saved.');
      } else {
        console.log('No token received in response.');
      }

      return response.data;

    } catch (error) {
      console.error("Error signing in:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return error.response.data;
      } else {
        throw error;
      }
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

  const updateInfo = async (email: string, username: string, oldPassword: string, newPassword: string) => {
    console.log(`UPDATING INFOS...`);

    try {
      const response = await axios.put('http://localhost:8080/profile/update', { email, username, oldPassword, newPassword }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Received response from API:', response.data);
      return { status: response.status, message: response.data.message };
    } catch (error) {
      console.error("Error updating infos:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.data);
        return { status: error.response.status, message: error.response.data.message };
      } else {
        throw error;
      }
    }
};




  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{signUp, signIn, signOut, token, getUserInfo, updateInfo}}>
      {children}
    </UserContext.Provider>
  )
}
