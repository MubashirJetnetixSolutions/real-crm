import type { ResultSetHeader, RowDataPacket, SqlParam } from "./db";

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
  job_title: string | null;
  region: string | null;
  office: string | null;
  phone: string | null;
  status: string;
  avatar_url: string | null;
  deals_count: number;
  revenue_total: string;
  performance: number;
  joined_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBClient {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  type: "Buyer" | "Investor" | "Seller";
  budget: string | null;
  intent: string | null;
  status: "Active" | "Pending" | "Inactive";
  active_deals: number;
  closed_deals: number;
  avatar_url: string | null;
  joined_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBLead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  property_interest: string | null;
  budget: string | null;
  preferred_location: string | null;
  notes: string | null;
  stage: string;
  status: string;
  source: string | null;
  avatar_url: string | null;
  agent_id: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBFollowUp {
  id: number;
  lead_id: number;
  due_at: string;
  note: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface DBDeal {
  id: number;
  title: string;
  client_id: number | null;
  property_id: number | null;
  column_id: number;
  price: string | number;
  priority: string;
  stage: string | null;
  notes: string | null;
  image_url: string | null;
  agent_id: number | null;
  outcome: "open" | "won" | "lost";
  expected_close_at: string | null;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBProperty {
  id: number;
  code: string;
  title: string;
  description: string | null;
  location: string | null;
  type: string | null;
  price: number;
  price_label: string | null;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  image_url: string | null;
  agent_id: number | null;
  listed_at: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface DBPipeline {
  id: number;
  name: string;
  sort_order: number;
  deleted_at: string | null;
}

export interface DBPipelineColumn {
  id: number;
  pipeline_id: number;
  name: string;
  color: string;
  sort_order: number;
}

export interface DBActivityLog {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  details: string | null;
  ip: string | null;
  created_at: string;
}

export interface DBPasswordResetToken {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

function nowISO(): string {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

// Initial seed store
const initialUsers: DBUser[] = [
  {
    id: 1,
    name: "EstateX Admin",
    email: "admin@estatex.com",
    password_hash: "$2b$10$U5.lUVnrsV5SJzFxHYVd3O7JjBlvNOYDvn.ESfEZckSX4NBrWSvym", // admin123
    role: "admin",
    job_title: "Administrator",
    region: "HQ",
    office: "Head Office",
    phone: "+1 (555) 000-0001",
    status: "Active",
    avatar_url: "https://ui-avatars.com/api/?name=EstateX+Admin&background=004ac6&color=ffffff&bold=true",
    deals_count: 0,
    revenue_total: "0",
    performance: 0,
    joined_at: "2019-01-01",
    deleted_at: null,
    created_at: "2019-01-01 00:00:00",
    updated_at: "2019-01-01 00:00:00",
  },
  {
    id: 2,
    name: "Marcus Holloway",
    email: "marcus.h@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S", // agent123
    role: "user",
    job_title: "Senior Property Advisor",
    region: "Beverly Hills",
    office: "Downtown Branch, Suite 400",
    phone: "+1 (555) 010-1234",
    status: "Top Performer",
    avatar_url: "https://ui-avatars.com/api/?name=Marcus+Holloway&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 24,
    revenue_total: "4800000",
    performance: 92,
    joined_at: "2020-02-01",
    deleted_at: null,
    created_at: "2020-02-01 00:00:00",
    updated_at: "2020-02-01 00:00:00",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "elena.r@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S",
    role: "user",
    job_title: "Investment Specialist",
    region: "Manhattan",
    office: "Manhattan Office, Floor 12",
    phone: "+1 (555) 010-5678",
    status: "Active",
    avatar_url: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 18,
    revenue_total: "3100000",
    performance: 78,
    joined_at: "2021-03-01",
    deleted_at: null,
    created_at: "2021-03-01 00:00:00",
    updated_at: "2021-03-01 00:00:00",
  },
  {
    id: 4,
    name: "David Chen",
    email: "david.c@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S",
    role: "user",
    job_title: "Commercial Lead",
    region: "San Francisco",
    office: "SF Commercial Hub",
    phone: "+1 (555) 010-9012",
    status: "On Leave",
    avatar_url: "https://ui-avatars.com/api/?name=David+Chen&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 15,
    revenue_total: "5200000",
    performance: 85,
    joined_at: "2019-01-01",
    deleted_at: null,
    created_at: "2019-01-01 00:00:00",
    updated_at: "2019-01-01 00:00:00",
  },
  {
    id: 5,
    name: "Sarah Chen",
    email: "sarah.c@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S",
    role: "user",
    job_title: "Luxury Property Expert",
    region: "Miami Beach",
    office: "Miami Luxury Division",
    phone: "+1 (555) 010-3456",
    status: "Active",
    avatar_url: "https://ui-avatars.com/api/?name=Sarah+Chen&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 21,
    revenue_total: "7400000",
    performance: 88,
    joined_at: "2022-06-01",
    deleted_at: null,
    created_at: "2022-06-01 00:00:00",
    updated_at: "2022-06-01 00:00:00",
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.w@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S",
    role: "user",
    job_title: "Commercial Broker",
    region: "Chicago",
    office: "Chicago Loop Office",
    phone: "+1 (555) 010-7788",
    status: "Active",
    avatar_url: "https://ui-avatars.com/api/?name=James+Wilson&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 11,
    revenue_total: "8000000",
    performance: 64,
    joined_at: "2021-09-01",
    deleted_at: null,
    created_at: "2021-09-01 00:00:00",
    updated_at: "2021-09-01 00:00:00",
  },
  {
    id: 7,
    name: "Emily Davis",
    email: "emily.d@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S",
    role: "user",
    job_title: "Junior Agent",
    region: "Boston",
    office: "Boston Back Bay Office",
    phone: "+1 (555) 010-4455",
    status: "Active",
    avatar_url: "https://ui-avatars.com/api/?name=Emily+Davis&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 6,
    revenue_total: "1200000",
    performance: 45,
    joined_at: "2023-04-01",
    deleted_at: null,
    created_at: "2023-04-01 00:00:00",
    updated_at: "2023-04-01 00:00:00",
  },
  {
    id: 8,
    name: "Alex Rivera",
    email: "alex.r@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S",
    role: "user",
    job_title: "Senior Associate",
    region: "New York",
    office: "Upper West Side Office",
    phone: "+1 (555) 010-2299",
    status: "Active",
    avatar_url: "https://ui-avatars.com/api/?name=Alex+Rivera&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 14,
    revenue_total: "2900000",
    performance: 71,
    joined_at: "2022-01-01",
    deleted_at: null,
    created_at: "2022-01-01 00:00:00",
    updated_at: "2022-01-01 00:00:00",
  },
  {
    id: 9,
    name: "David Miller",
    email: "david.m@drimpact.com",
    password_hash: "$2b$10$1ERTm8vFjsOaMYC5LYX6U.UOqvOX.MKnJv17fUU5ZzXeyQReq107S",
    role: "user",
    job_title: "Commercial Specialist",
    region: "Chicago",
    office: "Chicago Commercial Desk",
    phone: "+1 (555) 010-6611",
    status: "Active",
    avatar_url: "https://ui-avatars.com/api/?name=David+Miller&background=dbe1ff&color=004ac6&bold=true",
    deals_count: 9,
    revenue_total: "2100000",
    performance: 58,
    joined_at: "2020-08-01",
    deleted_at: null,
    created_at: "2020-08-01 00:00:00",
    updated_at: "2020-08-01 00:00:00",
  },
];

const initialClients: DBClient[] = [
  {
    id: 1,
    name: "Eleanor Pemberton",
    email: "eleanor.p@icloud.com",
    phone: "+1 (555) 012-3456",
    address: "New York, NY",
    type: "Buyer",
    budget: "$2.5M - $3.8M",
    intent: "High Intent",
    status: "Active",
    active_deals: 3,
    closed_deals: 2,
    avatar_url: "https://ui-avatars.com/api/?name=Eleanor+Pemberton&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-01-12",
    deleted_at: null,
    created_at: "2024-01-12 10:00:00",
    updated_at: "2024-01-12 10:00:00",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    email: "m.thorne@vanguard.co",
    phone: "+1 (555) 987-6543",
    address: "Los Angeles, CA",
    type: "Investor",
    budget: "$10M - $25M",
    intent: "Portfolio Expansion",
    status: "Active",
    active_deals: 8,
    closed_deals: 12,
    avatar_url: "https://ui-avatars.com/api/?name=Marcus+Thorne&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2023-12-05",
    deleted_at: null,
    created_at: "2023-12-05 10:00:00",
    updated_at: "2023-12-05 10:00:00",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    email: "sarah.j@outlook.com",
    phone: "+1 (555) 234-5678",
    address: "Miami, FL",
    type: "Seller",
    budget: "$1.2M - $1.8M",
    intent: "Market Listing",
    status: "Pending",
    active_deals: 1,
    closed_deals: 0,
    avatar_url: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-02-14",
    deleted_at: null,
    created_at: "2024-02-14 10:00:00",
    updated_at: "2024-02-14 10:00:00",
  },
  {
    id: 4,
    name: "Julian Rossi",
    email: "j.rossi@studio.it",
    phone: "+1 (555) 345-6789",
    address: "Chicago, IL",
    type: "Buyer",
    budget: "$800K - $1.1M",
    intent: "Financing Review",
    status: "Inactive",
    active_deals: 2,
    closed_deals: 1,
    avatar_url: "https://ui-avatars.com/api/?name=Julian+Rossi&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2023-11-28",
    deleted_at: null,
    created_at: "2023-11-28 10:00:00",
    updated_at: "2023-11-28 10:00:00",
  },
  {
    id: 5,
    name: "Robert Chen",
    email: "robert.chen@mail.com",
    phone: "+1 (555) 456-7890",
    address: "San Francisco, CA",
    type: "Buyer",
    budget: "$1M - $1.5M",
    intent: "High Intent",
    status: "Active",
    active_deals: 1,
    closed_deals: 0,
    avatar_url: "https://ui-avatars.com/api/?name=Robert+Chen&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-03-02",
    deleted_at: null,
    created_at: "2024-03-02 10:00:00",
    updated_at: "2024-03-02 10:00:00",
  },
  {
    id: 6,
    name: "Liam O'Connell",
    email: "liam.oc@mail.com",
    phone: "+1 (555) 567-8901",
    address: "Boston, MA",
    type: "Buyer",
    budget: "$3M - $4M",
    intent: "Negotiating",
    status: "Active",
    active_deals: 1,
    closed_deals: 0,
    avatar_url: "https://ui-avatars.com/api/?name=Liam+OConnell&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-04-18",
    deleted_at: null,
    created_at: "2024-04-18 10:00:00",
    updated_at: "2024-04-18 10:00:00",
  },
  {
    id: 7,
    name: "Ana Folau",
    email: "ana.folau@mail.com",
    phone: "+1 (555) 678-9012",
    address: "Seattle, WA",
    type: "Buyer",
    budget: "$700K - $800K",
    intent: "Closed Won",
    status: "Active",
    active_deals: 0,
    closed_deals: 1,
    avatar_url: "https://ui-avatars.com/api/?name=Ana+Folau&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-01-30",
    deleted_at: null,
    created_at: "2024-01-30 10:00:00",
    updated_at: "2024-01-30 10:00:00",
  },
  {
    id: 8,
    name: "Nexus Corp",
    email: "realestate@nexus.com",
    phone: "+1 (555) 789-0123",
    address: "Austin, TX",
    type: "Investor",
    budget: "$8M - $10M",
    intent: "Commercial Expansion",
    status: "Active",
    active_deals: 1,
    closed_deals: 0,
    avatar_url: "https://ui-avatars.com/api/?name=Nexus+Corp&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-05-06",
    deleted_at: null,
    created_at: "2024-05-06 10:00:00",
    updated_at: "2024-05-06 10:00:00",
  },
  {
    id: 9,
    name: "Sheikh Al-Rashid",
    email: "office@alrashid.ae",
    phone: "+971 50 123 4567",
    address: "Dubai / Beverly Hills",
    type: "Buyer",
    budget: "$40M+",
    intent: "VIP Acquisition",
    status: "Active",
    active_deals: 1,
    closed_deals: 0,
    avatar_url: "https://ui-avatars.com/api/?name=Sheikh+Al+Rashid&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-06-01",
    deleted_at: null,
    created_at: "2024-06-01 10:00:00",
    updated_at: "2024-06-01 10:00:00",
  },
  {
    id: 10,
    name: "David Brooks",
    email: "d.brooks@mail.com",
    phone: "+1 212 990 8877",
    address: "New York, NY",
    type: "Buyer",
    budget: "$5M+",
    intent: "Commercial Interest",
    status: "Pending",
    active_deals: 0,
    closed_deals: 0,
    avatar_url: "https://ui-avatars.com/api/?name=David+Brooks&background=dbe1ff&color=004ac6&bold=true",
    joined_at: "2024-05-22",
    deleted_at: null,
    created_at: "2024-05-22 10:00:00",
    updated_at: "2024-05-22 10:00:00",
  },
];

const initialProperties: DBProperty[] = [
  {
    id: 1,
    code: "PROP-8241",
    title: "Skyline Penthouse",
    description: "Experience unparalleled luxury in this stunning penthouse located in the heart of downtown.",
    location: "Upper West Side, NY",
    type: "Apartment",
    price: 4250000,
    price_label: "$4,250,000",
    beds: 4,
    baths: 3,
    sqft: 3200,
    status: "Available",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    agent_id: 8,
    listed_at: "2023-10-12",
    deleted_at: null,
    created_at: "2023-10-12 00:00:00",
  },
  {
    id: 2,
    code: "PROP-9102",
    title: "Serene Waters Villa",
    description: "A breathtaking waterfront villa with private beach access and infinity pool.",
    location: "Miami Beach, FL",
    type: "Villa",
    price: 8900000,
    price_label: "$8,900,000",
    beds: 6,
    baths: 7,
    sqft: 5800,
    status: "Sold",
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    agent_id: 5,
    listed_at: "2023-09-28",
    deleted_at: null,
    created_at: "2023-09-28 00:00:00",
  },
  {
    id: 3,
    code: "PROP-4452",
    title: "The Hub Plaza",
    description: "Premium commercial plaza in the central business district.",
    location: "Chicago, IL",
    type: "Commercial",
    price: 15500,
    price_label: "$15,500/mo",
    beds: 0,
    baths: 4,
    sqft: 12000,
    status: "Rented",
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    agent_id: 9,
    listed_at: "2023-11-05",
    deleted_at: null,
    created_at: "2023-11-05 00:00:00",
  },
];

const initialLeads: DBLead[] = [
  {
    id: 1,
    name: "Sarah Miller",
    email: "sarah.miller@mail.com",
    phone: "+1 234 567 890",
    property_interest: "Skyline Penthouse",
    budget: "$1.2M - $1.5M",
    preferred_location: "Upper West Side",
    notes: "Interested in high-floor units",
    stage: "Negotiation",
    status: "Hot",
    source: "Website",
    avatar_url: "https://ui-avatars.com/api/?name=Sarah+Miller&background=dbe1ff&color=004ac6&bold=true",
    agent_id: 2,
    deleted_at: null,
    created_at: "2026-03-01 10:00:00",
    updated_at: "2026-03-01 10:00:00",
  },
  {
    id: 2,
    name: "Marcus Chen",
    email: "marcus.chen@mail.com",
    phone: "+1 987 654 321",
    property_interest: "Luxury Beachfront Villa",
    budget: "$4.5M",
    preferred_location: "Miami Beach",
    notes: "Looking for waterfront with dock",
    stage: "Inquiry",
    status: "Warm",
    source: "Referral",
    avatar_url: "https://ui-avatars.com/api/?name=Marcus+Chen&background=dbe1ff&color=004ac6&bold=true",
    agent_id: 3,
    deleted_at: null,
    created_at: "2026-03-01 12:00:00",
    updated_at: "2026-03-01 12:00:00",
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james.w.lead@mail.com",
    phone: "+1 555 010 888",
    property_interest: "Downtown Modern Loft",
    budget: "$850K",
    preferred_location: "Chicago Loop",
    notes: "Ready to make offer",
    stage: "Closed",
    status: "Hot",
    source: "Website",
    avatar_url: "https://ui-avatars.com/api/?name=James+Wilson&background=dbe1ff&color=004ac6&bold=true",
    agent_id: 4,
    deleted_at: null,
    created_at: "2026-02-28 09:00:00",
    updated_at: "2026-02-28 09:00:00",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    email: "elena.r.lead@mail.com",
    phone: "+1 305 444 2211",
    property_interest: "Family Villa - South Beach",
    budget: "$2.1M",
    preferred_location: "South Beach",
    notes: "Requires large backyard",
    stage: "Viewing",
    status: "Hot",
    source: "Instagram",
    avatar_url: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=dbe1ff&color=004ac6&bold=true",
    agent_id: 5,
    deleted_at: null,
    created_at: "2026-03-01 14:00:00",
    updated_at: "2026-03-01 14:00:00",
  },
  {
    id: 5,
    name: "David Brooks",
    email: "d.brooks@mail.com",
    phone: "+1 212 990 8877",
    property_interest: "Office Space - Midtown",
    budget: "$5M+",
    preferred_location: "Midtown Manhattan",
    notes: "Corporate office relocation",
    stage: "Contacted",
    status: "Cold",
    source: "LinkedIn",
    avatar_url: "https://ui-avatars.com/api/?name=David+Brooks&background=dbe1ff&color=004ac6&bold=true",
    agent_id: 6,
    deleted_at: null,
    created_at: "2026-02-28 15:00:00",
    updated_at: "2026-02-28 15:00:00",
  },
  {
    id: 6,
    name: "Amina Yusuf",
    email: "amina.y@mail.com",
    phone: "+1 617 333 9900",
    property_interest: "Modern Studio - Heights",
    budget: "$600K - $750K",
    preferred_location: "Boston Heights",
    notes: "First-time home buyer",
    stage: "New",
    status: "Warm",
    source: "Website",
    avatar_url: "https://ui-avatars.com/api/?name=Amina+Yusuf&background=dbe1ff&color=004ac6&bold=true",
    agent_id: 7,
    deleted_at: null,
    created_at: "2026-03-01 16:00:00",
    updated_at: "2026-03-01 16:00:00",
  },
];

const initialPipelines: DBPipeline[] = [
  { id: 1, name: "Main Residential", sort_order: 0, deleted_at: null },
  { id: 2, name: "Commercial", sort_order: 1, deleted_at: null },
  { id: 3, name: "Luxury Collection", sort_order: 2, deleted_at: null },
];

const initialColumns: DBPipelineColumn[] = [
  { id: 1, pipeline_id: 1, name: "New Deal", color: "bg-primary", sort_order: 0 },
  { id: 2, pipeline_id: 1, name: "Negotiation", color: "bg-secondary", sort_order: 1 },
  { id: 3, pipeline_id: 1, name: "Booking", color: "bg-tertiary", sort_order: 2 },
  { id: 4, pipeline_id: 1, name: "Documentation", color: "bg-secondary", sort_order: 3 },
  { id: 5, pipeline_id: 1, name: "Closed", color: "bg-tertiary", sort_order: 4 },
  { id: 6, pipeline_id: 2, name: "Prospect", color: "bg-secondary", sort_order: 0 },
  { id: 7, pipeline_id: 2, name: "Due Diligence", color: "bg-primary", sort_order: 1 },
  { id: 8, pipeline_id: 2, name: "Offer", color: "bg-tertiary", sort_order: 2 },
  { id: 9, pipeline_id: 2, name: "Closed", color: "bg-tertiary", sort_order: 3 },
  { id: 10, pipeline_id: 3, name: "Discovery", color: "bg-primary", sort_order: 0 },
  { id: 11, pipeline_id: 3, name: "Private Tour", color: "bg-secondary", sort_order: 1 },
  { id: 12, pipeline_id: 3, name: "Offer", color: "bg-tertiary", sort_order: 2 },
  { id: 13, pipeline_id: 3, name: "Closed", color: "bg-tertiary", sort_order: 3 },
];

const initialDeals: DBDeal[] = [
  {
    id: 1,
    title: "Skyline Penthouse",
    client_id: 5,
    property_id: 1,
    column_id: 1,
    price: 1250000,
    priority: "High Priority",
    stage: "Inquiry",
    notes: "Client interested in units above 30th floor.",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    agent_id: null,
    outcome: "open",
    expected_close_at: "2026-06-30",
    sort_order: 0,
    deleted_at: null,
    created_at: "2026-02-01 10:00:00",
    updated_at: "2026-02-01 10:00:00",
  },
  {
    id: 2,
    title: "Oakwood Estate",
    client_id: 3,
    property_id: null,
    column_id: 1,
    price: 890000,
    priority: "Normal",
    stage: "Inquiry",
    notes: "Needs financing pre-approval before proceeding.",
    image_url: null,
    agent_id: 5,
    outcome: "open",
    expected_close_at: "2026-07-15",
    sort_order: 1,
    deleted_at: null,
    created_at: "2026-02-05 10:00:00",
    updated_at: "2026-02-05 10:00:00",
  },
  {
    id: 3,
    title: "Waterfront Villa",
    client_id: 6,
    property_id: null,
    column_id: 2,
    price: 3450000,
    priority: "Payment Pending",
    stage: "Negotiation",
    notes: "Counter-offer sent. Awaiting client response.",
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    agent_id: 4,
    outcome: "open",
    expected_close_at: "2026-08-01",
    sort_order: 0,
    deleted_at: null,
    created_at: "2026-02-10 10:00:00",
    updated_at: "2026-02-10 10:00:00",
  },
  {
    id: 4,
    title: "Mountain Retreat",
    client_id: 7,
    property_id: null,
    column_id: 5,
    price: 720000,
    priority: "Closed Won",
    stage: "Closed",
    notes: null,
    image_url: null,
    agent_id: 5,
    outcome: "won",
    expected_close_at: "2026-01-20",
    sort_order: 0,
    deleted_at: null,
    created_at: "2026-01-10 10:00:00",
    updated_at: "2026-01-20 10:00:00",
  },
  {
    id: 5,
    title: "Downtown Office Block",
    client_id: 8,
    property_id: null,
    column_id: 6,
    price: 8400000,
    priority: "High Priority",
    stage: "Prospect",
    notes: null,
    image_url: null,
    agent_id: null,
    outcome: "open",
    expected_close_at: "2026-09-30",
    sort_order: 0,
    deleted_at: null,
    created_at: "2026-02-15 10:00:00",
    updated_at: "2026-02-15 10:00:00",
  },
  {
    id: 6,
    title: "Private Island Estate",
    client_id: 9,
    property_id: null,
    column_id: 10,
    price: 42000000,
    priority: "VIP",
    stage: "Discovery",
    notes: null,
    image_url: null,
    agent_id: null,
    outcome: "open",
    expected_close_at: "2026-12-31",
    sort_order: 0,
    deleted_at: null,
    created_at: "2026-02-20 10:00:00",
    updated_at: "2026-02-20 10:00:00",
  },
];

const initialFollowUps: DBFollowUp[] = [
  { id: 1, lead_id: 1, due_at: "2026-03-05 10:00:00", note: "Discuss counter-offer details", completed_at: null, created_at: "2026-03-01 10:00:00" },
  { id: 2, lead_id: 4, due_at: "2026-03-06 14:00:00", note: "Confirm second viewing appointment", completed_at: null, created_at: "2026-03-01 14:00:00" },
  { id: 3, lead_id: 5, due_at: "2026-03-07 11:00:00", note: "Send midtown office space brochure", completed_at: null, created_at: "2026-02-28 15:00:00" },
  { id: 4, lead_id: 6, due_at: "2026-03-05 16:00:00", note: "Initial qualification call", completed_at: null, created_at: "2026-03-01 16:00:00" },
];

class MemoryStore {
  users = [...initialUsers];
  clients = [...initialClients];
  leads = [...initialLeads];
  properties = [...initialProperties];
  pipelines = [...initialPipelines];
  columns = [...initialColumns];
  deals = [...initialDeals];
  followUps = [...initialFollowUps];
  activityLogs: DBActivityLog[] = [];
  resetTokens: DBPasswordResetToken[] = [];

  private nextUserId = 100;
  private nextClientId = 100;
  private nextLeadId = 100;
  private nextDealId = 100;
  private nextTokenId = 100;
  private nextLogId = 1;

  async executeQuery<T extends RowDataPacket>(sql: string, params: readonly SqlParam[] = []): Promise<T[]> {
    const cleanSql = sql.replace(/\s+/g, " ").trim();

    // ── USERS ────────────────────────────────────────────────────────────────
    if (/SELECT \* FROM users WHERE email = \? AND deleted_at IS NULL/i.test(cleanSql)) {
      const email = String(params[0] ?? "").toLowerCase();
      const user = this.users.find((u) => u.email.toLowerCase() === email && !u.deleted_at);
      return (user ? [user] : []) as unknown as T[];
    }

    if (/SELECT \* FROM users WHERE id = \? AND deleted_at IS NULL/i.test(cleanSql)) {
      const id = Number(params[0]);
      const user = this.users.find((u) => u.id === id && !u.deleted_at);
      return (user ? [user] : []) as unknown as T[];
    }

    if (/SELECT id, name, email, role, avatar_url FROM users WHERE id = \? AND deleted_at IS NULL/i.test(cleanSql)) {
      const id = Number(params[0]);
      const user = this.users.find((u) => u.id === id && !u.deleted_at);
      return (
        user
          ? [{ id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url }]
          : []
      ) as unknown as T[];
    }

    if (/SELECT 1 FROM users WHERE email = \? LIMIT 1/i.test(cleanSql)) {
      const email = String(params[0] ?? "").toLowerCase();
      const exists = this.users.some((u) => u.email.toLowerCase() === email && !u.deleted_at);
      return (exists ? [{ 1: 1 }] : []) as unknown as T[];
    }

    if (/SELECT id, name, job_title, avatar_url FROM users WHERE deleted_at IS NULL AND status <> 'Inactive' ORDER BY name/i.test(cleanSql)) {
      const active = this.users
        .filter((u) => !u.deleted_at && u.status !== "Inactive")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((u) => ({ id: u.id, name: u.name, job_title: u.job_title, avatar_url: u.avatar_url }));
      return active as unknown as T[];
    }

    // ── PROPERTIES ───────────────────────────────────────────────────────────
    if (/SELECT id, code, title, status FROM properties WHERE deleted_at IS NULL ORDER BY title/i.test(cleanSql)) {
      const rows = this.properties
        .filter((p) => !p.deleted_at)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((p) => ({ id: p.id, code: p.code, title: p.title, status: p.status }));
      return rows as unknown as T[];
    }

    // ── CLIENTS ──────────────────────────────────────────────────────────────
    if (/SELECT COUNT\(\*\) AS total FROM clients/i.test(cleanSql)) {
      let filtered = this.clients.filter((c) => !c.deleted_at);
      // parse params if filters applied
      return [{ total: filtered.length }] as unknown as T[];
    }

    if (/SELECT \* FROM clients WHERE deleted_at IS NULL/i.test(cleanSql)) {
      let filtered = this.clients.filter((c) => !c.deleted_at);
      return filtered as unknown as T[];
    }

    if (/SELECT \* FROM clients WHERE id = \? AND deleted_at IS NULL/i.test(cleanSql)) {
      const id = Number(params[0]);
      const client = this.clients.find((c) => c.id === id && !c.deleted_at);
      return (client ? [client] : []) as unknown as T[];
    }

    if (/SELECT 1 FROM clients WHERE email = \? AND deleted_at IS NULL/i.test(cleanSql)) {
      const email = String(params[0] ?? "").toLowerCase();
      const exists = this.clients.some((c) => c.email?.toLowerCase() === email && !c.deleted_at);
      return (exists ? [{ 1: 1 }] : []) as unknown as T[];
    }

    if (/SELECT id, title, price, status, date FROM deals WHERE client_id = \?/i.test(cleanSql)) {
      const clientId = Number(params[0]);
      const clientDeals = this.deals
        .filter((d) => d.client_id === clientId && !d.deleted_at)
        .map((d) => ({ id: d.id, title: d.title, price: String(d.price), status: d.stage ?? "Open", date: d.created_at }));
      return clientDeals as unknown as T[];
    }

    // Generic CLIENTS query
    if (cleanSql.startsWith("SELECT * FROM clients")) {
      let list = this.clients.filter((c) => !c.deleted_at);
      return list as unknown as T[];
    }

    // ── TOP PERFORMERS ──────────────────────────────────────────────────────
    if (/FROM users u\s+LEFT JOIN leads l/i.test(cleanSql) || /COUNT\(l\.id\) AS total_leads/i.test(cleanSql)) {
      const activeAgents = this.users.filter((u) => !u.deleted_at && u.role !== "admin" && u.status !== "Inactive");
      const stats = activeAgents.map((u) => {
        const assignedLeads = this.leads.filter((l) => l.agent_id === u.id && !l.deleted_at);
        const totalLeads = assignedLeads.length;
        const leadsConverted = assignedLeads.filter((l) => l.stage === "Closed").length;
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          avatar_url: u.avatar_url,
          job_title: u.job_title,
          region: u.region,
          status: u.status,
          deals_count: u.deals_count,
          revenue_total: u.revenue_total,
          performance: u.performance,
          total_leads: totalLeads,
          leads_converted: leadsConverted,
        };
      });
      stats.sort((a, b) => b.performance - a.performance || b.leads_converted - a.leads_converted || b.total_leads - a.total_leads);
      return stats as unknown as T[];
    }

    // ── LEADS ────────────────────────────────────────────────────────────────
    if (/SELECT COUNT\(\*\) AS total FROM leads/i.test(cleanSql)) {
      let filtered = this.leads.filter((l) => !l.deleted_at);
      return [{ total: filtered.length }] as unknown as T[];
    }

    if (/SELECT l\.\*.*FROM leads l/i.test(cleanSql)) {
      if (/WHERE l\.id = \?/i.test(cleanSql)) {
        const id = Number(params[0]);
        const l = this.leads.find((x) => x.id === id && !x.deleted_at);
        if (!l) return [] as unknown as T[];
        const agent = this.users.find((u) => u.id === l.agent_id && !u.deleted_at);
        const hasFollowUp = this.followUps.some((f) => f.lead_id === l.id && !f.completed_at);
        return [
          {
            ...l,
            agent_name: agent?.name ?? null,
            agent_avatar: agent?.avatar_url ?? null,
            has_follow_up: hasFollowUp ? 1 : 0,
          },
        ] as unknown as T[];
      }

      let rows = this.leads
        .filter((l) => !l.deleted_at)
        .map((l) => {
          const agent = this.users.find((u) => u.id === l.agent_id && !u.deleted_at);
          const hasFollowUp = this.followUps.some((f) => f.lead_id === l.id && !f.completed_at);
          return {
            ...l,
            agent_name: agent?.name ?? null,
            agent_avatar: agent?.avatar_url ?? null,
            has_follow_up: hasFollowUp ? 1 : 0,
          };
        });

      if (/ORDER BY/i.test(cleanSql)) {
        const isDesc = /DESC/i.test(cleanSql);
        if (/created_at/i.test(cleanSql)) {
          rows.sort((a, b) =>
            isDesc
              ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        } else if (/name/i.test(cleanSql)) {
          rows.sort((a, b) =>
            isDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
          );
        }
      } else {
        rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      const limitMatch = /LIMIT (\d+)/i.exec(cleanSql);
      const offsetMatch = /OFFSET (\d+)/i.exec(cleanSql);
      if (limitMatch) {
        const limit = Number(limitMatch[1]);
        const offset = offsetMatch ? Number(offsetMatch[1]) : 0;
        rows = rows.slice(offset, offset + limit);
      }

      return rows as unknown as T[];
    }

    // ── DEALS & PIPELINES ────────────────────────────────────────────────────
    if (/SELECT c\.id, c\.pipeline_id, c\.name FROM pipeline_columns c/i.test(cleanSql)) {
      if (/WHERE c\.name = \?/i.test(cleanSql)) {
        const name = String(params[0] ?? "");
        const col = this.columns.find((c) => c.name.toLowerCase() === name.toLowerCase());
        return (col ? [col] : []) as unknown as T[];
      }
      return this.columns.slice(0, 1) as unknown as T[];
    }

    if (/SELECT d\.id, d\.title, d\.price, d\.priority.*FROM deals d/i.test(cleanSql)) {
      const rows = this.deals
        .filter((d) => !d.deleted_at)
        .map((d) => {
          const client = this.clients.find((c) => c.id === d.client_id);
          const agent = this.users.find((u) => u.id === d.agent_id);
          return {
            id: d.id,
            title: d.title,
            price: typeof d.price === "number" ? `$${d.price.toLocaleString()}` : String(d.price),
            priority: d.priority,
            stage: d.stage,
            notes: d.notes,
            image_url: d.image_url,
            outcome: d.outcome,
            expected_close_at: d.expected_close_at,
            column_id: d.column_id,
            client_name: client?.name ?? null,
            agent_name: agent?.name ?? null,
            created_at: d.created_at,
            updated_at: d.updated_at,
          };
        });
      return rows as unknown as T[];
    }

    // ── PASSWORD RESET ───────────────────────────────────────────────────────
    if (/SELECT id, user_id FROM password_reset_tokens/i.test(cleanSql)) {
      const tokenHash = String(params[0] ?? "");
      const token = this.resetTokens.find((t) => t.token_hash === tokenHash && !t.used_at);
      return (token ? [token] : []) as unknown as T[];
    }

    // Fallback: empty array
    return [] as unknown as T[];
  }

  async executeMutation(sql: string, params: readonly SqlParam[] = []): Promise<ResultSetHeader> {
    const cleanSql = sql.replace(/\s+/g, " ").trim();

    // ── INSERT USERS ─────────────────────────────────────────────────────────
    if (cleanSql.startsWith("INSERT INTO users")) {
      const id = ++this.nextUserId;
      this.users.push({
        id,
        name: String(params[0] ?? ""),
        email: String(params[1] ?? "").toLowerCase(),
        password_hash: String(params[2] ?? ""),
        role: (params[3] as "admin" | "user") ?? "user",
        avatar_url: String(params[4] ?? null),
        job_title: "Agent",
        region: "Main",
        office: "HQ",
        phone: null,
        status: "Active",
        deals_count: 0,
        revenue_total: "0",
        performance: 0,
        joined_at: nowISO().substring(0, 10),
        deleted_at: null,
        created_at: nowISO(),
        updated_at: nowISO(),
      });
      return { insertId: id, affectedRows: 1, warningStatus: 0 } as ResultSetHeader;
    }

    // ── UPDATE USERS ─────────────────────────────────────────────────────────
    if (/UPDATE users SET password_hash = \? WHERE id = \?/i.test(cleanSql)) {
      const hash = String(params[0] ?? "");
      const id = Number(params[1]);
      const u = this.users.find((x) => x.id === id);
      if (u) u.password_hash = hash;
      return { insertId: 0, affectedRows: u ? 1 : 0, warningStatus: 0 } as ResultSetHeader;
    }

    // ── INSERT ACTIVITY LOGS ─────────────────────────────────────────────────
    if (cleanSql.startsWith("INSERT INTO activity_logs")) {
      const id = ++this.nextLogId;
      this.activityLogs.push({
        id,
        user_id: params[0] !== null ? Number(params[0]) : null,
        action: String(params[1] ?? ""),
        entity_type: params[2] ? String(params[2]) : null,
        entity_id: params[3] !== null ? Number(params[3]) : null,
        details: params[4] ? String(params[4]) : null,
        ip: params[5] ? String(params[5]) : null,
        created_at: nowISO(),
      });
      return { insertId: id, affectedRows: 1, warningStatus: 0 } as ResultSetHeader;
    }

    // ── INSERT CLIENTS ───────────────────────────────────────────────────────
    if (cleanSql.startsWith("INSERT INTO clients")) {
      const id = ++this.nextClientId;
      this.clients.push({
        id,
        name: String(params[0] ?? ""),
        email: params[1] ? String(params[1]) : null,
        phone: params[2] ? String(params[2]) : null,
        address: params[3] ? String(params[3]) : null,
        type: (params[4] as "Buyer" | "Investor" | "Seller") ?? "Buyer",
        budget: params[5] ? String(params[5]) : null,
        intent: params[6] ? String(params[6]) : null,
        status: (params[7] as "Active" | "Pending" | "Inactive") ?? "Active",
        avatar_url: params[8] ? String(params[8]) : null,
        active_deals: 0,
        closed_deals: 0,
        joined_at: nowISO().substring(0, 10),
        deleted_at: null,
        created_at: nowISO(),
        updated_at: nowISO(),
      });
      return { insertId: id, affectedRows: 1, warningStatus: 0 } as ResultSetHeader;
    }

    // ── UPDATE CLIENTS ───────────────────────────────────────────────────────
    if (/UPDATE clients SET deleted_at = NOW\(\) WHERE id = \?/i.test(cleanSql)) {
      const id = Number(params[0]);
      const c = this.clients.find((x) => x.id === id);
      if (c) c.deleted_at = nowISO();
      return { insertId: 0, affectedRows: c ? 1 : 0, warningStatus: 0 } as ResultSetHeader;
    }

    if (cleanSql.startsWith("UPDATE clients SET")) {
      const id = Number(params[params.length - 1]);
      const c = this.clients.find((x) => x.id === id);
      if (c) {
        c.updated_at = nowISO();
      }
      return { insertId: 0, affectedRows: c ? 1 : 0, warningStatus: 0 } as ResultSetHeader;
    }

    // ── INSERT LEADS ─────────────────────────────────────────────────────────
    if (cleanSql.startsWith("INSERT INTO leads")) {
      const id = ++this.nextLeadId;
      this.leads.push({
        id,
        name: String(params[0] ?? ""),
        email: params[1] ? String(params[1]) : null,
        phone: params[2] ? String(params[2]) : null,
        property_interest: params[3] ? String(params[3]) : null,
        budget: params[4] ? String(params[4]) : null,
        preferred_location: params[5] ? String(params[5]) : null,
        notes: params[6] ? String(params[6]) : null,
        stage: String(params[7] ?? "New"),
        status: String(params[8] ?? "Warm"),
        source: params[9] ? String(params[9]) : null,
        avatar_url: params[10] ? String(params[10]) : null,
        agent_id: params[11] !== null ? Number(params[11]) : null,
        deleted_at: null,
        created_at: nowISO(),
        updated_at: nowISO(),
      });
      return { insertId: id, affectedRows: 1, warningStatus: 0 } as ResultSetHeader;
    }

    // ── UPDATE LEADS ─────────────────────────────────────────────────────────
    if (/UPDATE leads SET deleted_at = NOW\(\) WHERE id = \?/i.test(cleanSql)) {
      const id = Number(params[0]);
      const l = this.leads.find((x) => x.id === id);
      if (l) l.deleted_at = nowISO();
      return { insertId: 0, affectedRows: l ? 1 : 0, warningStatus: 0 } as ResultSetHeader;
    }

    if (cleanSql.startsWith("UPDATE leads SET")) {
      const id = Number(params[params.length - 1]);
      const l = this.leads.find((x) => x.id === id);
      if (l) {
        l.updated_at = nowISO();
      }
      return { insertId: 0, affectedRows: l ? 1 : 0, warningStatus: 0 } as ResultSetHeader;
    }

    // ── INSERT DEALS ─────────────────────────────────────────────────────────
    if (cleanSql.startsWith("INSERT INTO deals")) {
      const id = ++this.nextDealId;
      this.deals.push({
        id,
        title: String(params[0] ?? ""),
        client_id: params[1] !== null ? Number(params[1]) : null,
        property_id: params[2] !== null ? Number(params[2]) : null,
        column_id: Number(params[3] ?? 1),
        price: (params[4] as string | number) ?? 0,
        priority: String(params[5] ?? "Normal"),
        stage: params[6] ? String(params[6]) : null,
        notes: params[7] ? String(params[7]) : null,
        agent_id: params[8] !== null ? Number(params[8]) : null,
        image_url: null,
        outcome: "open",
        expected_close_at: params[9] ? String(params[9]) : null,
        sort_order: 0,
        deleted_at: null,
        created_at: nowISO(),
        updated_at: nowISO(),
      });
      return { insertId: id, affectedRows: 1, warningStatus: 0 } as ResultSetHeader;
    }

    // ── PASSWORD RESET TOKENS ────────────────────────────────────────────────
    if (cleanSql.startsWith("INSERT INTO password_reset_tokens")) {
      const id = ++this.nextTokenId;
      this.resetTokens.push({
        id,
        user_id: Number(params[0]),
        token_hash: String(params[1]),
        expires_at: new Date(Date.now() + 30 * 60000).toISOString(),
        used_at: null,
        created_at: nowISO(),
      });
      return { insertId: id, affectedRows: 1, warningStatus: 0 } as ResultSetHeader;
    }

    if (/UPDATE password_reset_tokens SET used_at = NOW\(\) WHERE id = \?/i.test(cleanSql)) {
      const id = Number(params[0]);
      const t = this.resetTokens.find((x) => x.id === id);
      if (t) t.used_at = nowISO();
      return { insertId: 0, affectedRows: t ? 1 : 0, warningStatus: 0 } as ResultSetHeader;
    }

    if (/UPDATE password_reset_tokens SET used_at = NOW\(\) WHERE user_id = \? AND used_at IS NULL/i.test(cleanSql)) {
      const userId = Number(params[0]);
      let count = 0;
      for (const t of this.resetTokens) {
        if (t.user_id === userId && !t.used_at) {
          t.used_at = nowISO();
          count++;
        }
      }
      return { insertId: 0, affectedRows: count, warningStatus: 0 } as ResultSetHeader;
    }

    return { insertId: 0, affectedRows: 1, warningStatus: 0 } as ResultSetHeader;
  }
}

// Global in-memory singleton across hot-reloads
const globalMemoryStore = globalThis as unknown as { __estatex_memory_store?: MemoryStore };
if (!globalMemoryStore.__estatex_memory_store) {
  globalMemoryStore.__estatex_memory_store = new MemoryStore();
}

export const memoryStore = globalMemoryStore.__estatex_memory_store;
