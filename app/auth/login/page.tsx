"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const navigate = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === 'authenticated') {
      navigate.push('/');
    }
  }, [status, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      setError("");
      navigate.push('/');
    }
  };

  return (
    !session && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="lg:w-[450px]">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && <p className="text-red-500">{error}</p>}
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
              Login
            </button>
          </form>
          <div className="text-left text-xs mt-2">
            Don't have an account? <Link href="/auth/signup" className="text-sm">Signup</Link>
          </div>
        </div>
      </div>
    )
  );
};

export default LoginPage;
