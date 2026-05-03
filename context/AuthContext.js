// context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

// ✅ This is what was missing — export the context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.log("AuthContext error:", error);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}