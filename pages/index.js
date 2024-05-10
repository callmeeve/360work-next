import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "@/components/partials/LoginForm";
import Unauthorized from "@/components/partials/Unauthorized";

function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      if (user.role === "EMPLOYEE") {
        router.push("/employee");
      } else if (user.role === "MANAGER") {
        router.push("/manager");
      } else {
        setIsAuthorized(false);
      }
    } else {
      router.push("/");
    }
  }, []);

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return <LoginForm />;
}

export default Home;