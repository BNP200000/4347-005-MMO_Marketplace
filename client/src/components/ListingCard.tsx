"use client";
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => (
  <Card className="mb-3" style={{ width: '100%' }}>
    <Card.Body className="d-flex justify-content-between align-items-center">
      <div>
        <h5 className="mb-2 font-weight-bold">{listing.item_name}</h5>
        <p className="text-muted mb-1">Listed by: {listing.character_name}</p>
        <p className="text-muted mb-1">Quantity: {listing.quantity}</p>
        <p className="text-muted mb-1">Price: {listing.sale_price} gold</p>
      </div>
      <Button variant="outline-primary">View</Button>
    </Card.Body>
  </Card>
);