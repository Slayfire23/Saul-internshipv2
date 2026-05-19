"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForYouPage() {
  const [userLabel, setUserLabel] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLabel(user?.email || (user ? "Guest user" : ""));
    });

    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <main className="for-you">
      <div className="for-you__content">
        <Link className="for-you__logo" href="/">
          Summarist
        </Link>
        <h1 className="for-you__title">For You</h1>
        <p className="for-you__subtitle">
          {userLabel
            ? `You are logged in as ${userLabel}.`
            : "You are currently logged out."}
        </p>
        {userLabel ? (
          <button className="btn for-you__button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link className="btn for-you__button" href="/">
            Back to login
          </Link>
        )}
      </div>
    </main>
  );
}
