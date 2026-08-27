export interface PropertyData {
  id: string;
  propId: string;
  title: string;
  location: string;
  type: string;
  price: string;
  priceNum: number;
  beds: number;
  baths: number;
  sqft: number;
  status: "Available" | "Sold" | "Rented";
  listedDate: string;
  imageUrl: string;
  agentName: string;
  agentRole: string;
  agentAvatar: string;
  description?: string;
  gallery?: string[];
}

const galleryPool = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa5a6cb?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
];

export function getPropertyGallery(property: PropertyData): string[] {
  if (property.gallery?.length) return property.gallery;
  const images = [property.imageUrl, ...galleryPool.filter((u) => u !== property.imageUrl)];
  return images.slice(0, 12);
}

export interface AgentData {
  id: string;
  name: string;
  role: string;
  region: string;
  status: string;
  statusClass: string;
  deals: number;
  revenue: string;
  progress: number;
  avatar: string;
  email?: string;
  phone?: string;
  office?: string;
  joined?: string;
}

export const propertiesData: PropertyData[] = [
  {
    id: "prop-1",
    propId: "PROP-8241",
    title: "Skyline Penthouse",
    location: "Upper West Side, NY",
    type: "Apartment",
    price: "$4,250,000",
    priceNum: 4250000,
    beds: 4,
    baths: 3,
    sqft: 3200,
    status: "Available",
    listedDate: "Oct 12, 2023",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBeqvM3MNA6SQ5E-u6Kyi9gBSIeFCafsgDdX_11R0bDblYxY7ANkqf9iqtPFLzO-wr9a6RyZST-1aEX0j46tMi-KNZW1F5-QGuPTopzgr9u1qXDRYFBVVgM6Ud4mxyzezlFrC7oL8gacXd5DDiACbgah0frKY3Ga-8FPxr9G3z6g6UENGhHycP0CXQY5uV_R_ow3TgASnnU42gm29d_BU02u0m8iwvyOIl98nPqXtMf__kbaVhMO4IF1I4NDOCQvGe7c_I9DylbxDst",
    agentName: "Alex Rivera",
    agentRole: "Senior Associate",
    agentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAV8sZ7Dx2KULsgVP_vp0vL_f8ky2ycJMnueiVZg2E982_tmDqoTbXafOaDHNEFY85kDYDy2-6d3-8fuqqyD5Gb-6Im9pigoeCg20Jb5WKLwqJnmNqIwqmVRDOQDHSyeko1k6wGbS0ASMeDnN6IUC8GMc-_D_wFMn5bUehI0I1Gfl-SFH_JL4xcNIIqpdIjXpyzPI4MaWT6urgaFmG3ewLKxA7z3uU5Dp5dwdk_K3KK7kk3dVh2WgErOY8rfp4f_D992Jq4Ajl9s1p",
    description:
      "Experience unparalleled luxury in this stunning penthouse located in the heart of downtown. Floor-to-ceiling windows offer panoramic city views, a state-of-the-art chef's kitchen, and a spa-inspired primary suite.",
  },
  {
    id: "prop-2",
    propId: "PROP-9102",
    title: "Serene Waters Villa",
    location: "Miami Beach, FL",
    type: "Villa",
    price: "$8,900,000",
    priceNum: 8900000,
    beds: 6,
    baths: 7,
    sqft: 5800,
    status: "Sold",
    listedDate: "Sep 28, 2023",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2ncIOyIOVaP9w5PiKXbznbkZ92sxSxfkingZt0mQNDT5WmacU2XAUs5grg_NSL00-OYy_MvLt_sBF4ztgOS_lwV1f2otCEqiYyqkRf63MsmaeFgCDM40qE1ygEeZu_imcsxWeI61YJBmUAY-i6W8ph-FQo2SWOeWpH_yjkAdIkTbE86Y_9V_2q6RI89CgxxF3WLfBp1qdYfaVA3lkJ4fs8ZGhnErEjZINsvKyBCrlBJT0u-P_8UCxozEZNtk2So5xvenHDxlFzti9",
    agentName: "Sarah Chen",
    agentRole: "Listing Expert",
    agentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEHpX5_iNKm4nCyQszPiGWV-GVf4DhSGBtlIFaZrJjREnggT_VrlYBCaowdVms9NeHIAXbO_gKSv2CGQZG1yx4VOY7jA8Yawiy73bS3mYZD_aNCDL7PS2tC0ODQ9HD-RzHl3V0ghAE9hr12wd4H0bLOMbSEmJ8BGkKltmjFDnG-HSgXPy7xou-k6LjN7Ny3BTrxNj6d5kcOInxDZ9HiVAkr53rKApKKGp0ucR23XGE6F9Z8QUoDaAIyZ-t1DrbSkjGimF_Y1QOpSSh",
  },
  {
    id: "prop-3",
    propId: "PROP-4452",
    title: "The Hub Plaza",
    location: "Chicago, IL",
    type: "Commercial",
    price: "$15,500/mo",
    priceNum: 15500,
    beds: 0,
    baths: 4,
    sqft: 12000,
    status: "Rented",
    listedDate: "Nov 05, 2023",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnclJog3tgWGbHJQ9Pc15Zbie3WIJep_ws_ptwOE3IHdEwanNLFO89uZry6nFqfwQl3awIrxef9mD57dm5TdLZwRKwyI_d43w6o5RsbSjVNiXxAtqHOdhQW-XChJOVEujB2r3sDRKIwwnlpr8SM_KMPoClHOBKg2HQlvL7fvUiQ3Tf4qL1x200wjEjucJ2p-MrM-eKKjF3P3P2BBTkQECfnIZrBSR1gaEE1H9PkwiwyLtmGisrdLtwDG6VCGoZ1K40TXeAsGW-AGa3",
    agentName: "David Miller",
    agentRole: "Commercial Specialist",
    agentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYz5lS7DC22aFJjSW8HN9UGfbQBXN5JdN1Z1Rt9m7OC9SfNYifgViloYN8WMrno6R75bPOyWkJEULEa0PB4QOQD90oMHgSe9s3UFaYpLLKAlCsA_HuvimaaX06_xJmI9NmLQQt7JWtXx2SZ9WdOd2L4vsCb82zyCJ1fjGhCR-dUaS77f9sYBRfZL6VmPq-NAFLGXhzDQVzn-rBBKpi3T36HY8LICPVT1puW4Ie6orzQhB4uNg_FtGJi5Hif13DLFiwq07OFEjHhXM",
  },
];

export const agentsData: AgentData[] = [
  {
    id: "1",
    name: "Marcus Holloway",
    role: "Senior Property Advisor",
    region: "Beverly Hills",
    status: "Top Performer",
    statusClass: "bg-tertiary text-on-tertiary",
    deals: 24,
    revenue: "$4.8M",
    progress: 92,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs5c_f7JIMFz2A6T0EfLL-fcKd6GW_-QV3_X2HObN-bbLuSa4-KssG_56C75OAtg9xoyOoZLd_hnJRiOVhUTp4jDYIxFZn3oarS0sPKtyTSxiQHtekUnB94zuJDD30ETy_4MmZ0gZ-Mc9BaS7sFgc9lRP8Cmx0Fll9VT47ZD4uyCfnilHxB5nM_zJXOQ5IwSMBpl1RydikZ9r075LsGtua7txzo7D2mB_aWxBYanN0f6gY4mApjtBsleX7vNAH3kzR-oMHSzoJVxif",
    email: "marcus.h@drImpact.com",
    phone: "+1 (555) 010-1234",
    office: "Downtown Branch, Suite 400",
    joined: "Feb 2020",
  },
  {
    id: "2",
    name: "Elena Rodriguez",
    role: "Investment Specialist",
    region: "Manhattan",
    status: "Active",
    statusClass: "bg-primary text-on-primary",
    deals: 18,
    revenue: "$3.1M",
    progress: 78,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxE0jce8vE5W-dXmkGl1J03gaZn0Mm21Rt6vxzFUsmsXnMVXQbOfX9Q1mKs4rp8cIWMuCRm_njeN1gINtsBbmhrxTZHz1l0ykdI4uHwzglzdfYA1MCakwWPrlvhL7Eq_VS7kKnmaCqYzSSCl52xFTfH5FYn1z03yfwxvA4ujKrbJM9daA9MVyWwa2Y1WS3IMyNgOYmsF-7S8Y-uj6p6SBStO5eVcTR6F6daip2zma3bweW88_WTNQ7aW7rZufpSJWkp1nZ4QYoUdWc",
    email: "elena.r@drImpact.com",
    phone: "+1 (555) 010-5678",
    office: "Manhattan Office, Floor 12",
    joined: "Mar 2021",
  },
  {
    id: "3",
    name: "David Chen",
    role: "Commercial Lead",
    region: "San Francisco",
    status: "On Leave",
    statusClass: "bg-surface-container-highest text-on-surface-variant",
    deals: 15,
    revenue: "$5.2M",
    progress: 85,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC94YvfWylQL3Qxxl91UYJHn7feg10NLuPV3YGfckmGCtxooVWlOognlxGRrPKfuGGIIgQwkC0U2IfTeTufE3ULqEVUMGwC8IEyyZ6m4zdjKaZ-WMUP3qWrw4wRVqjZgQhRUnuQsji31DNAOvdg9WXJ5EobnQ6p0rZXKPna3PncleBpCguw5M1PhdRyPsVl4VU3T2bx1u9ut_w7leNCSx3tcpDpDf0Yo-cWbmTmgekBa4GjA0RE0Yf02B8ssydWD49RukSEd5Lij5ym",
    email: "david.c@drImpact.com",
    phone: "+1 (555) 010-9012",
    office: "SF Commercial Hub",
    joined: "Jan 2019",
  },
  {
    id: "4",
    name: "Sarah Chen",
    role: "Luxury Property Expert",
    region: "Miami Beach",
    status: "Active",
    statusClass: "bg-primary text-on-primary",
    deals: 21,
    revenue: "$7.4M",
    progress: 88,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfyXqMv17C8qKjS4J8fpR-p0CZRMyhEzWviTvh9Cbx6meNDQun_MtBdoHouJ8mmDRU-CC2WsPxH2KPXQ9hSoH2D-6Zp47I9xD6xvNJ0Kj35LFY4i2RNTb1orEToZ-92wbbNTf8b8GcayqKE2oh61syElA37CtBDUcjmzt5qoom5FwRgyNtNKUR8PoIhnZwGiVK2aUUIsj2ffpbYnUN4znM5UrZ7sOtVkF9YTGhJ5fTAgmpMQrnw7Y5Saej0b2iW4xMNZOfK_den3b",
    email: "sarah.c@drImpact.com",
    phone: "+1 (555) 010-3456",
    office: "Miami Luxury Division",
    joined: "Jun 2022",
  },
];

export const searchIndex = [
  { type: "Lead", label: "Sarah Miller", href: "/leads/lead-1", keywords: "sarah miller penthouse hot" },
  { type: "Lead", label: "Marcus Chen", href: "/leads/lead-2", keywords: "marcus chen villa warm" },
  { type: "Client", label: "Eleanor Pemberton", href: "/clients/client-1", keywords: "eleanor pemberton buyer" },
  { type: "Client", label: "Marcus Thorne", href: "/clients/client-2", keywords: "marcus thorne investor" },
  { type: "Property", label: "Skyline Penthouse", href: "/properties/prop-1", keywords: "skyline penthouse apartment ny" },
  { type: "Property", label: "Serene Waters Villa", href: "/properties/prop-2", keywords: "serene waters villa miami" },
  { type: "Deal", label: "Skyline Penthouse Deal", href: "/deals", keywords: "skyline deal robert chen" },
  { type: "Agent", label: "Marcus Holloway", href: "/team/1", keywords: "marcus holloway beverly hills" },
  { type: "Agent", label: "Elena Rodriguez", href: "/team/2", keywords: "elena rodriguez manhattan" },
];

const CUSTOM_PROPERTIES_KEY = "drImpact_custom_properties";

export function getCustomProperties(): PropertyData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    return raw ? (JSON.parse(raw) as PropertyData[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomProperty(property: PropertyData) {
  if (typeof window === "undefined") return;
  const existing = getCustomProperties().filter((p) => p.id !== property.id);
  localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify([property, ...existing]));
}

export function getPropertyById(id: string): PropertyData | undefined {
  const found = propertiesData.find((p) => p.id === id);
  if (found) return found;
  const custom = getCustomProperties().find((p) => p.id === id);
  if (custom) return custom;
  return undefined;
}

export function getAgentById(id: string): AgentData | undefined {
  const found = agentsData.find((a) => a.id === id);
  if (found) return found;
  return {
    id,
    name: "Team Agent",
    role: "Real Estate Agent",
    region: "Regional Office",
    status: "Active",
    statusClass: "bg-primary text-on-primary",
    deals: 10,
    revenue: "$2.0M",
    progress: 70,
    avatar: `https://ui-avatars.com/api/?name=Agent+${id}&background=dbe1ff&color=004ac6&bold=true`,
    email: "agent@drImpact.com",
    phone: "+1 (555) 000-0000",
    office: "Main Office",
    joined: "Jan 2023",
  };
}
