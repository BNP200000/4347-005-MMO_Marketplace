"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Alert } from "react-bootstrap";
import { isLoggedIn } from "../utils/loginCookie";

type Character = {
  character_id: string;
  character_name: string;
  exp_level: number;
  character_class: string;
};

export default function UserCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        if (!isLoggedIn()) {
          setError("Please log in to view your characters");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5001/getCharacters", {
          method: "GET",
          credentials: "include",  // Important for sending cookies
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          let errorMessage = "Failed to fetch characters";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }
    
        const data = await response.json();
        setCharacters(data);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching characters:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (!isLoggedIn() && !loading) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Please log in to view your characters.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">My Characters</h1>
      
      {loading && (
        <Alert variant="info">Loading your characters...</Alert>
      )}

      {error && (
        <Alert variant="danger">
          {error}
          {error.includes("Failed to connect") && (
            <div className="mt-2">
              <small>
                Please ensure:
                <ul>
                  <li>The server is running on port 5001</li>
                  <li>You  connected to the internet</li>
                  <li>There are no firewall issues blocking the connection</li>
                </ul>
              </small>
            </div>
          )}
        </Alert>
      )}

      {!loading && !error && (
        <Row>
          <Col>
            {characters.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Character ID</th>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {characters.map((character) => (
                    <tr key={character.character_id}>
                      <td>{character.character_id}</td>
                      <td>{character.character_name}</td>
                      <td>{character.exp_level}</td>
                      <td>{character.character_class}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">
                You don ve any characters yet.
              </Alert>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}