"use client";
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

// Define the props for CreateListingModal component
interface CreateListingModalProps {
  show: boolean;
  onHide: () => void;
  onCreateListing: (listingData: {
    character_id: string;
    item_id: string;
    quantity: number;
    listing_date: string;
    sale_price: number;
  }) => Promise<void>;
  characterId: string;
  characterName: string;
}

// Define the types for dropdown options and new listing state
interface DropdownOption {
  id: string;
  name: string;
}

interface NewListingState {
  item_id: string;
  quantity: number;
  listing_date: string;
  sale_price: number;
}

export default function CreateListingModal({ 
  show, 
  onHide, 
  onCreateListing,
  characterId,
  characterName
}: CreateListingModalProps) {
  const [newListing, setNewListing] = useState<NewListingState>({
    item_id: '',
    quantity: 1,
    listing_date: new Date().toISOString().slice(0, 10),
    sale_price: 0,
  });

  const [error, setError] = useState(''); // State to handle errors
  const [items, setItems] = useState<DropdownOption[]>([]); // State to store fetched items

  // Fetch available items when the modal is shown
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/listing/items`);
        if (Array.isArray(response.data)) {
          setItems(response.data);
          setError(''); // Reset error state on successful data fetch
        } else {
          setError('Failed to load items');
        }
      } catch (error) {
        // Handle axios and other errors
        if (axios.isAxiosError(error)) {
          setError(`Failed to load data: ${error.message}`);
        } else {
          setError('Failed to load data');
        }
      }
    };

    if (show) {
      fetchItems(); // Fetch items only when the modal is visible
    }
  }, [show]);

  // Handle form submission to create a new listing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error state before submission

    try {
      // Create the new listing
      await onCreateListing({
        character_id: characterId,
        item_id: newListing.item_id,
        quantity: newListing.quantity,
        listing_date: newListing.listing_date,
        sale_price: newListing.sale_price,
      });
      onHide(); // Close the modal after successful listing creation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>} {/* Display error if any */}
        <p><strong>Character:</strong> {characterName} (ID: {characterId})</p>
        <Form onSubmit={handleSubmit}>
          {/* Item selection dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Item</Form.Label>
            <Form.Select
              value={newListing.item_id}
              onChange={(e) => setNewListing({ ...newListing, item_id: e.target.value })}
              required
            >
              <option value="">Select an Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Quantity input */}
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={newListing.quantity}
              onChange={(e) => setNewListing({ ...newListing, quantity: parseInt(e.target.value) })}
              required
            />
          </Form.Group>

          {/* Listing date input */}
          <Form.Group className="mb-3">
            <Form.Label>Listing Date</Form.Label>
            <Form.Control
              type="date"
              value={newListing.listing_date}
              onChange={(e) => setNewListing({ ...newListing, listing_date: e.target.value })}
              required
            />
          </Form.Group>

          {/* Sale price input */}
          <Form.Group className="mb-3">
            <Form.Label>Sale Price</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={newListing.sale_price}
              onChange={(e) => setNewListing({ ...newListing, sale_price: parseFloat(e.target.value) })}
              required
            />
          </Form.Group>

          {/* Modal action buttons */}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Listing
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
