import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import { LoginRegister } from './components/LoginRegister/LoginRegister';
import GoogleFormsPage from "./components/GoogleFormsPage/GoogleFormsPage";
import AdminPanel from "./components/AdminPanel/AdminPanel";

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleSignUp = async () => {
    const response = await fetch('http://localhost/Baze_2/src/components/php/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signUp',
        username: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  const handleSignIn = async () => {
    const response = await fetch('http://localhost/Baze_2/src/components/php/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signIn',
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    console.log(data);
    setMessage(data.message);

    if (data.success) {
      setCurrentUser(data.username);
      if (data.Rola === 0){
        navigate("/admin");
      }else {
        navigate("/forms");
      }
    }
  };

  return (
    <>
      {/* Dugme za promenu teme */}
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(prev => !prev)}
      >
        {darkMode ? "🌞 Light" : "🌙 Dark"}
      </button>

      <Routes>
        <Route
          path="/"
          element={
            <LoginRegister
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              message={message}
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
            />
          }
        />
        <Route path="/admin" element={<AdminPanel currentUser={currentUser}/>} />
        <Route path="/forms" element={<GoogleFormsPage currentUser={currentUser} />} />
      </Routes>
    </>
  );
}

export default App;
