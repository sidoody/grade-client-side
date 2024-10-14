import React from "react";
import { getAuth, signOut } from "firebase/auth";
import "./Navbar.css"; // Assuming you're using a separate CSS file for navbar styling

function Navbar({ user }) {
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  return (
    <div className="navbar">
      <span className="user-email">{user.email}</span>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
