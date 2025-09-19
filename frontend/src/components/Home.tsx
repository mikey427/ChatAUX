import React, { useEffect } from "react";

type Props = {};

export default function Home({}: Props) {
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:3000/api/user", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        window.location.href = "/login";
      }
    }
    checkAuth();
  }, []);

  async function handleSignOut() {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Signed out", res);
    window.location.href = "/login";
  }
  return (
    <div>
      Home
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
