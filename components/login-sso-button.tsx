"use client";

import { useState } from "react";

import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";

function LoginSSOButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { ssoLogin, ssoLogout } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);

    await ssoLogin();

    setIsLoading(false);
  };

  const handleLogout = () => {
    ssoLogout();
    console.log("Logout success!");
  };

  return (
    <>
      <Button
        onClick={() => handleLogin()}
        className="w-full text-lg py-6 cursor-pointer"
      >
        {isLoading ? "Signing in..." : "Sign In using SSO"}
      </Button>
      <Button
        onClick={() => handleLogout()}
        className="w-full text-lg py-6 cursor-pointer"
      >
        Logout
      </Button>
    </>
  );
}

export default LoginSSOButton;
