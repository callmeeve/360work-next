import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from "@/components/partials/LoginForm";

function Login() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      if (user.role === "EMPLOYEE") {
        router.push("/employee");
      } else if (user.role === "MANAGER") {
        router.push("/manager");
      }
    }
  }, []);

  return <LoginForm />;
}

export default Login;
