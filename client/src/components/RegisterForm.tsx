"use client";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setLoginCookie } from "@/utils/loginCookie";
import axios from "axios";

const PORT = process.env.PORT || 5001;

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !email) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Set the registration data in the cookie
    setLoginCookie({ username, password });

    await axios.post(`http://localhost:${PORT}/register`, {
      username,
      email,
      password,
    });
    // Redirect
    router.push("/");
  };

  return (
    <Form onSubmit={handleRegister}>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <h2>Register</h2>

      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 mt-3">
        Register
      </Button>

      <Form.Text
        className="text-center"
        style={{ display: "block", marginTop: "10px" }}
      >
        <Link href="/login">{"Already have an account?"}</Link>
      </Form.Text>
    </Form>
  );
}
