import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      // Save token and user data in state or local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // If user role is 'EMPLOYEE', redirect to employee-specific page
      if (user.role === "EMPLOYEE") {
        router.push("/employee");
      } else if (user.role === "MANAGER") {
        router.push("/manager");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error during login", error);
      // Show error message to user
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-1/3 p-4 space-y-4 bg-white">
        <h1 className="text-2xl font-medium text-center">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
