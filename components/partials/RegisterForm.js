import React, { useState } from "react";
import api from "../data/utils/api";
import { useRouter } from "next/router";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/api/auth/register", {
        username,
        email,
        password,
        role,
      });
      const { token, user } = response.data;

      // Save token and user data in state or local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "EMPLOYEE") {
        router.push("/employee");
      } else if (user.role === "MANAGER") {
        router.push("/manager");
      } else {
        router.push("/");
      }

    } catch (error) {
      console.error("Error during registration", error);
      // Show error message to user
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-1/3 p-4 space-y-4 bg-white">
        <h1 className="text-2xl font-medium text-center">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div>
            <label htmlFor="username" className="block">
                Username
            </label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full p-2 border rounded-md"
            />
        </div>
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
        <div>
            <label htmlFor="role" className="block">
                Role
            </label>
            <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full p-2 border rounded-md"
            >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
            </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
