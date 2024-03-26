import { useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm from "@/components/partials/RegisterForm";

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/");
    }
  }, []);

  return <RegisterForm />;
}
