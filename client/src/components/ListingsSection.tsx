"use client";

import React, { useState } from 'react';
import { Col, Button } from 'react-bootstrap';
import { ListingCard } from './ListingCard';
import { Listing, Character } from '../types';  
import CreateListingModal from './CreateListingModal';

// Define the props for ListingsSection component
interface ListingsSectionProps {
  title: string;
  listings: Listing[]; // List of listings to display
  showNewListingButton?: boolean; // Optional button to create a new listing
  characterId: string; // Required characterId prop
  characterInfo: Character; // Required characterInfo prop to access character_name
  onCreateListing: (listingData: {
    item_id: string;
    quantity: number;
    sale_price: number;
  }) => Promise<void>; // Function to handle new listing creation
}

export default function ListingsSection({ 
  title, 
  listings, 
  showNewListingButton = false, 
  characterId,
  characterInfo,
  onCreateListing 
}: ListingsSectionProps) {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  return (
    <Col md={6}>
      {/* Section title and New Listing button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{title}</h2>
        {showNewListingButton && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            New Listing
          </Button>
        )}
      </div>

      {/* Listings container with scrollable view */}
      <div className="listing-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {listings.map(listing => (
          <ListingCard key={listing.listing_id} listing={listing} />
        ))}
        {listings.length === 0 && (
          <p className="text-muted text-center">No listings available</p> // Display message if no listings
        )}
      </div>

      {/* Create Listing Modal */}
      <CreateListingModal
        show={showModal}
        onHide={() => setShowModal(false)} // Close modal when hidden
        onCreateListing={onCreateListing}
        characterId={characterId}
        characterName={characterInfo.character_name}
      />
    </Col>
  );
}
