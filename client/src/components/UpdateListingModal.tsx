"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface UpdateListingModalProps {
  show: boolean;
  onHide: () => void;
  onUpdateListing: (listingId: string, updatedFields: Record<string, any>) => Promise<void>;
  listingId: string;
  initialValues: {
    item_name?: string;
    quantity?: number;
    listing_date?: string;
    sale_price?: number;
  };
}

interface DropdownOption {
  id: string;
  name: string;
}

export default function UpdateListingModal({
  show,
  onHide,
  onUpdateListing,
  listingId,
  initialValues,
}: UpdateListingModalProps) {
  const [listing, setListing] = useState(initialValues);
  const [error, setError] = useState("");
  const [items, setItems] = useState<DropdownOption[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/listing/items`);
        if (Array.isArray(response.data)) {
          setItems(response.data);
          setError("");
        } else {
          setError("Failed to load items");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`Failed to load data: ${error.message}`);
        } else {
          setError("Failed to load data");
        }
      }
    };

    if (show) {
      fetchItems();
    }
  }, [show]);

  useEffect(() => {
    if (initialValues) {
      setListing(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Determine the fields that have changed
      const updatedFields = Object.entries(listing).reduce((acc, [key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== initialValues[key as keyof typeof initialValues]
        ) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(updatedFields).length === 0) {
        throw new Error("No changes to update");
      }

      await onUpdateListing(listingId, updatedFields);
      onHide();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update listing");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          {/* Item selection */}
          <Form.Group className="mb-3">
            <Form.Label>Item</Form.Label>
            <Form.Select
              value={listing.item_name || ""}
              onChange={(e) => setListing({ ...listing, item_name: e.target.value })}
              required
            >
              <option value="">Select an Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.name}>
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
              value={listing.quantity || ""}
              onChange={(e) => setListing({ ...listing, quantity: parseInt(e.target.value) })}
              required
            />
          </Form.Group>

          {/* Listing date input */}
          <Form.Group className="mb-3">
            <Form.Label>Listing Date</Form.Label>
            <Form.Control
              type="date"
              value={listing.listing_date || ""}
              onChange={(e) => setListing({ ...listing, listing_date: e.target.value })}
              required
            />
          </Form.Group>

          {/* Sale price input */}
          <Form.Group className="mb-3">
            <Form.Label>Sale Price</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={listing.sale_price || ""}
              onChange={(e) => setListing({ ...listing, sale_price: parseFloat(e.target.value) })}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Listing
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
