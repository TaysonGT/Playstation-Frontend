import React, { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContext, IUser } from '../types';
import toast from 'react-hot-toast';
import { checkNewUser, createFirstUser, getCurrentSession, login } from '../api/auth';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState(false)

  const navigate = useNavigate()
   
  const logoutUser = async () => {
    Cookies.remove('access_token')
    setCurrentUser(null);
  };

  const loginUser = async (username: string, password: string) => {
    if(currentUser){
        toast.error("لقد سجلت دخولك بالفعل!")
        navigate('/')
        return;
    }

    await login({username, password})
    .then(async({data})=>{
        if(data.success){
            toast.success(data.message)
            Cookies.set('access_token', data.token, {expires: new Date(data.expDate), secure: true, path: '/'})
            await getUserData()
            navigate('/')
        }else{
            toast.error(data.message)
        }
    })
  };

  const firstLogin = async (username: string, password: string) => {
    await createFirstUser({username, password})
    .then(async({data})=>{
        if(data.success){
            toast.success(data.message)
            Cookies.set('access_token', data.token, {expires: new Date(data.expDate), secure: true, path: '/'})
            await getUserData()
            navigate('/')
        }else{
            toast.error(data.message)
        }
    })
  };

  const getUserData = async () => {
    getCurrentSession()
    .then(({data})=>{
        if(!data.success) {
          setIsLoading(false)
          logoutUser()
          return
        };
        setCurrentUser(data.user)
    }).catch(()=>logoutUser())
    .finally(()=>setIsLoading(false))
  };

  useEffect(()=>{
    getUserData();
    checkNewUser()
    .then(({data})=>{
        if(!data.success) return;
        setNewUser(true)
    })
  },[])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        loginUser,
        firstLogin,
        logoutUser,
        newUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

