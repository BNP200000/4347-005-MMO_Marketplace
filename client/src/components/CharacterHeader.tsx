"use client";
import React from 'react';
import { Container } from 'react-bootstrap';
import { Character } from '../types';

// Define the props for CharacterHeader component
interface CharacterHeaderProps {
  character: Character;
}

// CharacterHeader component displays character name and gold balance
const CharacterHeader: React.FC<CharacterHeaderProps> = ({ character }) => (
  <div style={{ backgroundColor: '#f8f9fa', padding: '10px 20px', borderBottom: '1px solid #ddd' }}>
    <Container fluid className="d-flex justify-content-between align-items-center">
      <span style={{ fontWeight: 'bold' }}>Character: {character.character_name}</span>
      <span style={{ color: '#888' }}>Gold Balance: {character.gold_balance} gold</span>
    </Container>
  </div>
);

export default CharacterHeader;
