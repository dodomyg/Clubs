import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import axios from "axios"
axios.defaults.withCredentials=true

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat,setSelectedChat]=useState(null)
  const [notification,SetNotification]=useState([])
  const [chat, setChat] = useState([]);

  useEffect(() => {
        const fetchUser=async()=>{
                try {
                    const resp = await axios.get("http://localhost:8080/user/jwt",{withCredentials:true})
                    setUser(resp.data.getUser)
                    console.log(resp.data.getUser);
                } catch (error) {
                    console.log(error);
                }
        }

        fetchUser()
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chat, setChat,notification,SetNotification }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
