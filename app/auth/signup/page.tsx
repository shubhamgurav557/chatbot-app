"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignUpPage = () => {
  const navigate = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      navigate.push('/');
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      email,
      password
    }
    const result = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const data = await result.json();

    if (result.ok) {
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError(loginResult.error);
      } else {
        setError("");
        window.location.href = "/";
      }
    } else {
      setError(data.message);
    }
  };

  return (
    !session && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-[450px]">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
          <div className="text-left text-xs mt-2">
            Already have an account? <Link href="/auth/login" className="text-sm">Login</Link>
          </div>
        </div>
      </div>
    )
  );
};

export default SignUpPage;
