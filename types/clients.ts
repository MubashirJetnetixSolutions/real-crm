export const CLIENT_TYPES = ["Buyer", "Investor", "Seller"] as const;
export const CLIENT_STATUSES = ["Active", "Pending", "Inactive"] as const;

export type ClientType = (typeof CLIENT_TYPES)[number];
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

/** Client as returned by the API. */
export interface ClientDTO {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  type: ClientType;
  budget: string | null;
  intent: string | null;
  status: ClientStatus;
  activeDeals: number;
  closedDeals: number;
  avatarUrl: string | null;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** A deal summary shown on the client profile's property history. */
export interface ClientDealDTO {
  id: number;
  title: string;
  price: number;
  stage: string | null;
  outcome: "open" | "won" | "lost";
  imageUrl: string | null;
  updatedAt: string;
}
