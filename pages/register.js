import { useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm from "@/components/partials/RegisterForm";

export default function Register() {
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

  return <RegisterForm />;
}
