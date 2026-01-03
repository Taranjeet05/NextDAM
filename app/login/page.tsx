"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) console.error("Something went wrong");

    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link href={"/register"}>
              <Button variant="link">Sign Up</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-5">
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 p-0.5">
          <div className="flex items-center justify-center space-x-5">
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-3"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.84-6.84C35.9 2.34 30.36 0 24 0 14.64 0 6.56 5.38 2.56 13.22l7.98 6.2C12.64 13.22 17.88 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.64-.15-3.22-.43-4.76H24v9.02h12.95c-.56 2.98-2.23 5.5-4.75 7.18l7.3 5.66c4.28-3.96 6.48-9.8 6.48-17.1z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.54 28.42c-.48-1.44-.76-2.98-.76-4.58s.28-3.14.76-4.58l-7.98-6.2C.92 16.64 0 20.2 0 24c0 3.8.92 7.36 2.56 10.94l7.98-6.52z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.36 0 11.7-2.1 15.6-5.7l-7.3-5.66c-2.02 1.36-4.6 2.16-8.3 2.16-6.12 0-11.36-3.72-13.46-8.88l-7.98 6.52C6.56 42.62 14.64 48 24 48z"
                />
              </svg>
            </Button>

            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-3"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.6-4.04-1.6-.54-1.36-1.32-1.72-1.32-1.72-1.08-.74.08-.72.08-.72 1.2.08 1.84 1.24 1.84 1.24 1.06 1.84 2.78 1.3 3.46 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.46-1.34-5.46-5.98 0-1.32.48-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.16 0 0 1-.32 3.28 1.24.96-.26 1.98-.4 3-.4s2.04.14 3 .4c2.28-1.56 3.28-1.24 3.28-1.24.66 1.64.24 2.86.12 3.16.76.84 1.24 1.92 1.24 3.24 0 4.66-2.8 5.66-5.48 5.96.44.38.82 1.1.82 2.22v3.3c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
