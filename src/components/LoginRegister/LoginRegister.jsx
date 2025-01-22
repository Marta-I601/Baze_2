import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

export const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleToRegister = () => {
    setIsRegister(true); // Prelazak na registraciju
  };

  const toggleToLogin = () => {
    setIsRegister(false); // Povratak na login
  };

  return (
    <div className={`wrapper ${isRegister ? 'register-active' : 'login-active'}`}>
      <div className={`form-box ${isRegister ? 'hidden' : ''} login`}>
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={toggleToRegister}>
                Register
              </a>
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
        <form action="">
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Confirm Password" required />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> I agree to the terms & conditions!
            </label>
          </div>
          <button type="submit">Register</button>
          <div className="register-link">
            <p>
              Already have an account?{' '}
              <a href="#" onClick={toggleToLogin}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
