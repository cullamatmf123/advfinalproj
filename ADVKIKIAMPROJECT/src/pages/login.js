import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    setErrorEmail('');
    setErrorPassword('');
    setLoginError('');

    if (!email.endsWith('@gmail.com')) {
      setErrorEmail('Email is not a valid email');
      return;
    }
    if (password.length < 8 || password.length > 20) {
      setErrorPassword('Password must be between 8 and 20 characters');
      return;
    }

    const auth = getAuth(); // Get authentication instance

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // If successful, navigate to profile page
        window.location.href = '/book';
      })
      .catch((error) => {
        // Handle sign-in errors
        setLoginError(error.message);
      });
  };

  const handleSignup = () => {
    window.location.href = '/signup';
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-cover bg-center' style={{ backgroundImage: 'url(https://images.pexels.com/photos/3952078/pexels-photo-3952078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}>
      <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-md max-w-md w-full">
        <h1 className='text-4xl font-bold mb-8 text-gray-800 text-center'>Welcome Back!</h1>
        <div className='flex flex-col mb-6'>
          <label className='text-gray-800 mb-1' htmlFor='email'>Email</label>
          <input
            className='w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
            id='email'
            type='email'
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className='text-red-500 text-sm mt-1'>{errorEmail}</p>
        </div>
        <div className='flex flex-col mb-6'>
          <label className='text-gray-800 mb-1' htmlFor='password'>Password</label>
          <input
            className='w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
            id='password'
            type='password'
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className='text-red-500 text-sm mt-1'>{errorPassword}</p>
        </div>
        <button
          className='w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-green-600 transition duration-300 mb-4'
          onClick={handleLogin}
        >
          Login
        </button>
        {loginError && <p className='text-red-500 text-center mb-4'>{loginError}</p>}
        <button
          className='w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition duration-300'
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
