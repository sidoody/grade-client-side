import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./LoginForm.css"; // Import your CSS file

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset any existing errors

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      onLogin(userCredential.user); // Pass the authenticated user to the parent component
    } catch (error) {
      setError("Failed to login. Please check your email and password.");
      console.error("Login error: ", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Grader App</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Show error message */}
      </div>
    </div>
  );
}

export default LoginForm;
