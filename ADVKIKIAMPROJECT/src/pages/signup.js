import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignUp = () => {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up successfully:", user);
        setSuccess(true);
        setError("");

        const uniqueName = `${name}-${uuidv4()}`;

        // Save name to Firestore
        const db = getFirestore();
        setDoc(doc(db, "users", user.uid), {
          email: email,
          profileName: uniqueName
        });

        // Redirect to profile creation page with profile name in the URL
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Signup error:", error);
        setSuccess(false);
      });
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/5490916/pexels-photo-5490916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}>
      <p className="text-4xl font-bold mb-8 text-white">Sign Up </p>
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md max-w-md w-full">
        <label className="text-gray-800 mb-1" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="text-gray-800 mb-1" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-gray-800 mb-1" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-green-600 transition duration-300 mb-4"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        {success && (
          <p className="text-green-500 mt-2 text-center">Sign up successful</p>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition duration-300"
          onClick={handleLoginRedirect}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
