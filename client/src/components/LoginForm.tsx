"use client";
import { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import Link from "next/link";
import { setLoginCookie } from "@/utils/loginCookie";
import { useRouter } from "next/navigation";

const PORT = process.env.PORT || 5001;

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:${PORT}/login`, {
        username,
        password,
      });
      // Check for error message in response
      if (res.data.error) {
        setError(res.data.error);
      } else {
        // Set login data in the cookie
        setLoginCookie({ ...res.data.user });
        // Redirect to the home page
        router.push("/");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

      <Button
        disabled={loading}
        variant="primary"
        type="submit"
        className="w-100 mt-3"
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Login"}
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
