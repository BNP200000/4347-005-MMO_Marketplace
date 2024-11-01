"use client";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";
import { setLoginCookie } from "@/utils/loginCookie";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    // Save login data to the cookie
    setLoginCookie({ username, password });

    // Reset the form or redirect to a new page
    setUsername("");
    setPassword("");
    setError(null);

    // Redirect
    router.push("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <h2>Login</h2>

      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 mt-3">
        Login
      </Button>

      <Form.Text
        className="text-center"
        style={{ display: "block", marginTop: "10px" }}
      >
        <Link href="/register">{"Don't have an account?"}</Link>
      </Form.Text>
    </Form>
  );
}
