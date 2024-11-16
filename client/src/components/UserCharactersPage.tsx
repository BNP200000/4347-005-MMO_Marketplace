"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Container, Row, Col, Table } from "react-bootstrap";

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
        const response = await fetch("/getCharacters");
        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }
        const data = await response.json();
        setCharacters(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User's Characters</h1>
      <Container>
        <Row>
          <Col>
            {characters.length > 0 ? (
              <Table striped bordered hover>
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
              <p>No characters found for this user.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
