import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.scss'; // Import the SCSS file

const SignupPopup = ({ closePopup, handleSignup, signupFormData, handleSignupInputChange, signupError }) => {
  const [reenterPassword, setReenterPassword] = useState('');

  const handleReenterPasswordChange = (e) => {
    setReenterPassword(e.target.value);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '300px' }}>
        <h2 style={{ fontSize: '20px' }}>Sign Up</h2>
        {signupError && <p style={{ color: 'red', marginTop: '0', marginBottom: '10px' }}>{signupError}</p>}
        <form onSubmit={(e) => handleSignup(e, reenterPassword)}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={signupFormData.username}
            onChange={handleSignupInputChange}
            required
            style={{ marginTop: '10px', marginBottom: '20px', marginLeft: '5px' }}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={signupFormData.password}
            onChange={handleSignupInputChange}
            required
            style={{ marginBottom: '10px', marginLeft: '5px' }}
          />
          <br />
          <label htmlFor="reenterPassword">Confirm Password:</label>
          <input
            type="password"
            id="reenterPassword"
            name="reenterPassword"
            value={reenterPassword}
            onChange={handleReenterPasswordChange}
            required
            style={{ marginBottom: '10px', marginLeft: '5px' }}
          />
          <br />
          <button type="submit" style={{ fontWeight: '600', letterSpacing: '0.05em' }}>
            Sign Up
          </button>
        </form>
        <button onClick={closePopup} style={{ marginTop: '10px', fontWeight: '600', letterSpacing: '0.05em' }}>
          Close
        </button>
      </div>
    </div>
  );
};

const LoginPage = (props) => {
  const history = useNavigate();
  const { login } = useAuth();

  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });

  const [signupFormData, setSignupFormData] = useState({
    username: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  // Define setReenterPassword here
  const [reenterPassword, setReenterPassword] = useState('');

  const openSignupPopup = () => {
    setIsSignupPopupOpen(true);
  };

  const closeSignupPopup = () => {
    setIsSignupPopupOpen(false);
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData({
      ...signupFormData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://18.221.217.26:3002/login', loginFormData);
  
      console.log('Login success:', response);
  
      setSuccessMessage(response.data.message);
  
      if (response.data.user) {
        localStorage.setItem('userId', response.data.user._id.toString());
      }
      localStorage.setItem('token', response.data.token);
      login();
      setIsLoggedIn(true);
      props.callBack(true);
      history('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
  
      if (error.response && error.response.status === 401) {
        // Unauthorized (incorrect credentials)
        console.log('Setting login error');
        setLoginError('Invalid username or password');
      } else {
        // Other errors
        setLoginError('An error occurred during login. Please try again.');
      }
      setSuccessMessage('');
    }
  };

  const handleSignup = async (e, reenterPassword) => {
    e.preventDefault();

    if (signupFormData.password !== reenterPassword) {
      setSignupError('Passwords do not match.');
      // Clear input fields on error
      setSignupFormData({ username: '', password: '' });
      setReenterPassword('');
      return;
    }

    try {
      const response = await axios.post('http://18.221.217.26:3002/signup', signupFormData);

      setSuccessMessage(response.data.message);

      // Log in the user after a successful signup
      const loginResponse = await axios.post('http://18.221.217.26:3002/login', {
        username: signupFormData.username,
        password: signupFormData.password,
      });

      if (loginResponse.data.user) {
        localStorage.setItem('userId', loginResponse.data.user._id.toString());
      }
      localStorage.setItem('token', loginResponse.data.token);
      login();
      setIsLoggedIn(true);
      props.callBack(true);
      closeSignupPopup();
      history('/dashboard');
    } catch (error) {
      setSignupError('Error during signup. Please try again.');
      setSuccessMessage('');
      // Clear input fields on error
      setSignupFormData({ username: '', password: '' });
      setReenterPassword('');
    }
  };

  const handleSignupButtonClick = () => {
    openSignupPopup();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <section style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '400px' }}>
      {loginError && <p style={{ color: 'red', marginTop: '0', marginBottom: '10px' }}>{loginError}</p>}

        <h2 style={{ fontSize: '20px' }}>Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={loginFormData.username}
            onChange={handleLoginInputChange}
            required
            style={{ marginTop: '10px', marginBottom: '20px', marginLeft: '5px' }}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginFormData.password}
            onChange={handleLoginInputChange}
            required
            style={{ marginBottom: '10px', marginLeft: '5px' }}
          />
          <br />
          <button id="login" type="submit" style={{ fontWeight: '600', letterSpacing: '0.05em' }}>
            Login
          </button>
        </form>

        <button id="signUp" onClick={handleSignupButtonClick} style={{ fontWeight: '600', letterSpacing: '0.05em', marginTop: '10px' }}>
          Sign Up
        </button>

        {/* Signup Popup */}
        {isSignupPopupOpen && (
          <SignupPopup
            closePopup={closeSignupPopup}
            handleSignup={handleSignup}
            signupFormData={signupFormData}
            handleSignupInputChange={handleSignupInputChange}
            signupError={signupError}
          />
        )}
      </section>
    </div>
  );
};

export default LoginPage;
