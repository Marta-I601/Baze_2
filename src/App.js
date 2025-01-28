import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { LoginRegister } from './components/LoginRegister/LoginRegister';
import GoogleFormsPage from "./components/GoogleFormsPage/GoogleFormsPage";

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

//debugger

  const handleSignUp = async () => {
    const response = await fetch('http://localhost/php/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signUp',
        fName: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  const handleSignIn = async () => {
    const response = await fetch('http://localhost/php/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signIn',
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
    <GoogleFormsPage/>
      <LoginRegister/>
    </div>
  );
  
}

export default App;