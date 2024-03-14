import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from './Components/Home'
import Chat from './Components/Chat'
import "./App.css"

const App = () => {
  return (
    <div className='app'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/chat' element={<Chat/>} />
        </Routes>
    </div>
  )
}

export default App