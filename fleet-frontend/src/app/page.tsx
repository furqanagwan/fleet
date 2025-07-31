"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { Login } from "./components/loign/Login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "DRIVER") {
        if (user.mustUpdatePassword) {
          router.push("/driver/update-password");
        } else {
          router.push("/driver");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials");
    }
  };

  return (
    <Login
      heading="Fleet Login"
      buttonText="Log In"
      logo={{
        url: "/",
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
        alt: "Fleet Logo",
        title: "Fleet App",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(); // from your page logic
        }}
        className="w-full space-y-4"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>
    </Login>
  );
}
