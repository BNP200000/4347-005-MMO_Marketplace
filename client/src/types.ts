// types.ts

export interface Character {
  character_id: string;
  character_name: string;
  exp_level: number;
  gold_balance: number;
  owner: string;
  class: string;
  leader: string | null;
}

export interface Listing {
  listing_id: string;
  character_id: string;
  character_name: string;
  item_id: string;
  item_name: string;
  quantity: number;
  listing_date: string;
  is_active: boolean;
  sale_price: number;
}