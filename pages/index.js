import { useEffect } from "react";
import { useRouter } from "next/router";
import LoginForm from "@/components/partials/LoginForm";

function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      if (user.role === "EMPLOYEE") {
        router.push("/employee");
      } else if (user.role === "MANAGER") {
        router.push("/manager");
      }
    } else {
      router.push("/");
    }
  }, []);

  return <LoginForm />;
}

export default Home;
