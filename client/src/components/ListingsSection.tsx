//Section displaying listings 
"use client";

import React, { useState } from 'react';
import { Col, Button } from 'react-bootstrap';
import { ListingCard } from './ListingCard';
import { Listing, Character } from '../types';  
import CreateListingModal from './CreateListingModal';

interface ListingsSectionProps {
  title: string;
  listings: Listing[];
  showNewListingButton?: boolean;
  characterId: string;
  characterInfo: Character;
  onCreateListing: (listingData: {
    character: string;     
    item: string;        
    quantity: number;
    listing_date: string;
    sale_price: number;
  }) => Promise<void>;
}

export default function ListingsSection({ 
  title, 
  listings, 
  showNewListingButton = false, 
  characterId,
  characterInfo,
  onCreateListing 
}: ListingsSectionProps) {
  const [showModal, setShowModal] = useState(false);  

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
