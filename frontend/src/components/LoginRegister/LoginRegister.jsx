import React, { useState } from 'react';
import './LoginRegister.css';

export const LoginRegister = ({
  email, setEmail,
  password, setPassword,
  name, setName,
  message,
  onSignIn,
  onSignUp
}) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-container">
      {isLogin ? (
        <>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="options">
            <label>
              <input type="checkbox"/> Remember me
            </label>
          </div>
            <a href="#">Forgot password?</a>
          <button onClick={onSignIn}>Login</button>
          <p>{message}</p>
          <p>
            Don't have an account?{" "}
            <span className="link" onClick={() => setIsLogin(false)}>Register</span>
          </p>
        </>
      ) : (
        <>
          <h2>Registration</h2>
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
          />
          <label>
            <input type="checkbox" /> I agree to the terms & conditions!
          </label>
          <button onClick={onSignUp}>Register</button>
          <p>{message}</p>
          <p>
            Already have an account?{" "}
            <span className="link" onClick={() => setIsLogin(true)}>Login</span>
          </p>
        </>
      )}
    </div>
  );
};