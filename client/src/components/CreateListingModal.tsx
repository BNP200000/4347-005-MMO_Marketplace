//CreateListingModal that gives a form for inserting new listings
"use client";  

import React, { useState, useEffect } from 'react';  
import { Modal, Button, Form } from 'react-bootstrap'; 
import axios from 'axios'; 

 
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

 
interface CreateListingModalProps {
  show: boolean;  
  onHide: () => void;  
  onCreateListing: (listingData: { 
    character: string;
    item: string;
    quantity: number;
    listing_date: string;
    sale_price: number;
  }) => Promise<void>;
  characterId: string;  
  characterName: string;  
}

 
interface DropdownOption {
  id: string;
  name: string;
}

// Define the structure of the new listing's state
interface NewListingState {
  item_name: string;   
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
  // State to manage the form inputs
  const [newListing, setNewListing] = useState<NewListingState>({
    item_name: '',    
    quantity: 1,     
    listing_date: new Date().toISOString().slice(0, 10), // Default to today's date
    sale_price: 0,   
  });

  const [error, setError] = useState('');
  const [items, setItems] = useState<DropdownOption[]>([]);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/listing/items`); // Fetch items from backend
        if (Array.isArray(response.data)) {
          setItems(response.data); // If data is an array, set it to the items state
          setError(''); 
        } else {
          setError('Failed to load items'); // Set error if the response format is incorrect
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`Failed to load data: ${error.message}`); 
        } else {
          setError('Failed to load data'); 
        }
      }
    };

    // Fetch items only if the modal is visible
    if (show) {
      fetchItems();
    }
  }, [show]); 

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Reset error before submission

    try {
      // Call the onCreateListing callback with the form data
      await onCreateListing({
        character: characterName, 
        item: newListing.item_name,  
        quantity: newListing.quantity,  
        listing_date: newListing.listing_date,  
        sale_price: newListing.sale_price, 
      });
      onHide(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    }
  };

  return (
    <Modal show={show} onHide={onHide}> {/* Modal visibility controlled by 'show' prop */}
      <Modal.Header closeButton>
        <Modal.Title>Create New Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display error message if there is any */}
        {error && <div className="alert alert-danger">{error}</div>}
        
        {/* Display character information */}
        <p><strong>Character:</strong> {characterName} (ID: {characterId})</p>
        
        {/* Form for creating the new listing */}
        <Form onSubmit={handleSubmit}>
          {/* Item selection */}
          <Form.Group className="mb-3">
            <Form.Label>Item</Form.Label>
            <Form.Select
              value={newListing.item_name}  // Controlled input for item name
              onChange={(e) => setNewListing({ ...newListing, item_name: e.target.value })}
              required
            >
              <option value="">Select an Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.name}>  {/* Use item name as value */}
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

          {/* Buttons to cancel or submit the form */}
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
