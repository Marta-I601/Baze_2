import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Za navigaciju

  const toggleToRegister = () => {
    setIsRegister(true); // Prelazak na registraciju
  };

  const toggleToLogin = () => {
    setIsRegister(false); // Povratak na login
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost/php/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signIn', email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Login successful!');
        navigate('/dashboard');
      } else {
        alert(data.message || "Invalid email or password!");
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert("An error occurred while trying to log in.");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost/php/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signUp', username, email, password }),
      });
      const data = await response.json();

      if (data.success) {
        alert('Registration successful!');
        setIsRegister(false);
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className={`wrapper ${isRegister ? 'register-active' : 'login-active'}`}>
      <div className={`form-box ${isRegister ? 'hidden' : ''} login`}>
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" name="signIn">Login</button>
          <div className="register-link">
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={toggleToRegister}>Register</a>
            </p>
          </div>
          <div className="register-link">
            <p>
              Already have an account?{' '}
              <a href="https://myaccount.google.com/" onClick={toggleToRegister}>SignIn with Google!</a>
            </p>
          </div>
          <div className="register-link">
            <p>
              Already have an account?{' '}
              <a href="https://www.facebook.com/login.php/" onClick={toggleToRegister}>SignIn with Facebook!</a>
            </p>
          </div>
        </form>
      </div>

      <div className={`form-box ${isRegister ? '' : 'hidden'} register`}>
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>
          <div className="input-box">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> I agree to the terms & conditions!
            </label>
          </div>
          <button type="submit" name="signUp">Register</button>
          <div className="register-link">
            <p>
              Already have an account?{' '}
              <a href="#" onClick={toggleToLogin}>Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
