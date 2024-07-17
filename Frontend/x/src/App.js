import React, { useContext } from 'react'
import {Routes,Route, Navigate} from "react-router-dom"
import Home from './Components/Home'
import Chat from './Components/Chat'
import "./App.css"
import UserContext from './Components/context/UserContext'

const App = () => {
  const {user} = useContext(UserContext)
  return (
    <div className='app'>
        <Routes>
          <Route path='/' element={!user ? <Home/> : <Navigate to="/chat"/>} />
          <Route path='/chat' element={user ? <Chat/> : <Navigate to="/"/>} />
        </Routes>
    </div>
  )
}

export default App