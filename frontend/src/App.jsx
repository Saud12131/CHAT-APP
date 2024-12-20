
import './App.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Chats from './pages/chats';
import { Login } from './components/authentications/login';
import { Signup } from './components/authentications/signup';
export default function App() {
  return (
    <div className="App">

    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='chats' element={<Chats />}/>
      <Route path='login' element={<Login />}/>
      <Route path='signup' element={<Signup />}/>
    </Routes>
    </div>
    
  )
}