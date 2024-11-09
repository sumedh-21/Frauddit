import React, { useState, useEffect } from 'react';
import { signUp, signIn, logOut } from '../authActions';  // Firebase Auth functions
import { auth } from '../firebaseConfig';  // Import Firebase authentication

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password);
      setIsLoggedIn(true);
      console.log('Signed up successfully:', user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    try {
      const user = await signIn(email, password);
      setIsLoggedIn(true);
      console.log('Signed in successfully:', user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      setIsLoggedIn(false);
      console.log('Logged out successfully');
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle the request to the backend
  const handleRequestToBackend = async () => {
    setLoading(true);
    const token = await auth.currentUser.getIdToken(); // Get the ID token from Firebase

    try {
      const response = await fetch('http://localhost:5000/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Auto-fetch protected data when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      handleRequestToBackend();
    }
  }, [isLoggedIn]);

  return (
    <div>
      <h1>{isLoggedIn ? 'Welcome' : 'Please Sign In'}</h1>

      {!isLoggedIn ? (
        <>
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
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
        </>
      ) : (
        <>
          <button onClick={handleLogOut}>Log Out</button>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div>
              <h2>Protected Data from Backend:</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AuthForm;
