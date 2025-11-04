import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import {useRouter} from "next/navigation";
import { LogOutIcon } from "lucide-react";

const auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/register" },
    logout: { title: "Logout", url: "/" },
};

export const AuthState = () => {
      const [isAuth, setAuth] = useState(false);
      const router = useRouter();

    const logoutFn = async () => {
        await fetch("/api/logout", { method: "GET" });
        setAuth(false);
        router.push("/");
    }
    
    useEffect(() => {
    (async () => {
        const res = await fetch("/api/verify-token", {
        method: "GET",
        })
        setAuth(res.ok);
    })();
    }, []);

    return (          <div className="flex gap-2">
            {
              isAuth ?
                  <>
                    <Button variant="outline" size="sm" onClick={logoutFn}>
                      <LogOutIcon />
                      Log Out
                    </Button>
                  </>
                  :
                  <>
                    <Button asChild variant="outline" size="sm">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                    <Button asChild size="sm">
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  </>
            }
          </div>)
}
