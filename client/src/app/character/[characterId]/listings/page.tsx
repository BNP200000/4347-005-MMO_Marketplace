//Page that lists the listings of the selected character and all listings and can create new listings
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Spinner, Row } from 'react-bootstrap';
import { useParams } from 'next/navigation';
import axios from 'axios';
import CharacterHeader from '@/components/CharacterHeader';
import ListingsSection from '@/components/ListingsSection';
import { Character, Listing } from '../../../../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function ListingsPage() {
  const params = useParams();
  const characterId = Array.isArray(params.characterId)
    ? params.characterId[0] 
    : params.characterId;

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [characterInfo, setCharacterInfo] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch character and listings data when component mounts or characterId changes
  const fetchCharacterAndListings = useCallback(async () => {
    if (!characterId) return;

    try {
      const [characterResponse, listingsResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/table/CHARACTER`),
        axios.get(`${BACKEND_URL}/table/LISTING`),
      ]);

      // Find character information
      if (characterResponse.data) {
        const character = characterResponse.data.find(
          (char: Character) => char.character_id === characterId
        );
        if (character) {
          setCharacterInfo(character);
        } else {
          throw new Error('Character not found');
        }
      }

      // Filter and set listings for the specific character
      if (listingsResponse.data) {
        const characterListings = listingsResponse.data.filter(
          (listing: Listing) => listing.character_id === characterId
        );
        setMyListings(characterListings);
        setAllListings(listingsResponse.data);
      }
    } catch (err) {
      // Handle any errors from the fetch requests
      setError(err instanceof Error ? err.message : 'Failed to fetch listings or character information');
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  }, [characterId]);

  useEffect(() => {
    fetchCharacterAndListings(); // Fetch data when component mounts or characterId changes
  }, [fetchCharacterAndListings]);

  // Function to create a new listing
  const handleCreateListing = async (listingData: {
    character: string;
    item: string;
    quantity: number;
    listing_date: string;
    sale_price: number;
  }) => {
    try {
      if (!characterInfo) throw new Error('Character information not available');
      
      const newListing = {
        character: characterInfo.character_name,
        item: listingData.item,
        quantity: listingData.quantity,
        listing_date: listingData.listing_date,
        is_active: true,
        sale_price: listingData.sale_price,
      };
  
      await axios.post(`${BACKEND_URL}/table/LISTING`, newListing);
      fetchCharacterAndListings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  // Show error message if there's any error fetching data
  if (error) {
    return (
      <div className="text-danger text-center p-4">
        {error}
      </div>
    );
  }

  // Show error message if character is not found
  if (!characterInfo) {
    return (
      <div className="text-danger text-center p-4">
        Character not found
      </div>
    );
  }

  return (
    <>
      <CharacterHeader character={characterInfo} />
      <Container className="p-4">
        <h1 className="text-center mb-4">Listings</h1>
        <Row>
          {/* My Listings section */}
          <ListingsSection 
            title="My Listings" 
            listings={myListings}
            showNewListingButton={true}
            characterId={characterInfo.character_id} 
            characterInfo={characterInfo} 
            onCreateListing={handleCreateListing}
          />
          {/* All Listings section */}
          <ListingsSection 
            title="All Listings" 
            listings={allListings.filter(
              listing => listing.character_id !== characterId
            )}
            characterId={characterInfo.character_id} 
            characterInfo={characterInfo}
            onCreateListing={handleCreateListing}   
            showNewListingButton={false}  
          />
        </Row>
      </Container>
    </>
  );
}