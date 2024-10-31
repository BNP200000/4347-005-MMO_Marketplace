// LoginForm.tsx
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";
import { setLoginCookie } from "@/utils/loginCookie";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setError("All fields are required.");
      return;
    }

    // Save login data to the cookie
    setLoginCookie({ username, password, email });

    // Reset the form or redirect to a new page
    setUsername("");
    setPassword("");
    setEmail("");
    setError(null);

    // For example purposes, you could redirect or show a success message here
    alert("Login data saved successfully!");
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <Button
        variant="primary"
        type="submit"
        style={{ width: "100%", marginTop: "10px" }}
      >
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
