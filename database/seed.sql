-- ============================================================================
-- EstateX CRM — development seed data (mirrors the original UI mock data)
-- Run AFTER schema.sql:  mysql -u root estatex_crm < database/seed.sql
-- Login: admin@estatex.com / admin123   (agents: <email> / agent123)
-- ============================================================================

SET NAMES utf8mb4;

-- ── Users ───────────────────────────────────────────────────────────────────
-- Password hashes: admin123 / agent123 (bcrypt cost 12)
INSERT INTO users (id, name, email, password_hash, role, job_title, region, office, phone, status, avatar_url, deals_count, revenue_total, performance, joined_at) VALUES
(1, 'EstateX Admin',   'admin@estatex.com',    '$2b$12$WJgV1gViaaqG3USMq2oYUOpCI3QYjU/hJqBNAade97TyW5wtin7y.', 'admin', 'Administrator',          'HQ',            'Head Office',                '+1 (555) 000-0001', 'Active',        'https://ui-avatars.com/api/?name=EstateX+Admin&background=004ac6&color=ffffff&bold=true',   0,  0,        0,  '2019-01-01'),
(2, 'Marcus Holloway', 'marcus.h@drimpact.com','$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Senior Property Advisor','Beverly Hills', 'Downtown Branch, Suite 400', '+1 (555) 010-1234', 'Top Performer', 'https://ui-avatars.com/api/?name=Marcus+Holloway&background=dbe1ff&color=004ac6&bold=true', 24, 4800000,  92, '2020-02-01'),
(3, 'Elena Rodriguez', 'elena.r@drimpact.com', '$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Investment Specialist',  'Manhattan',     'Manhattan Office, Floor 12', '+1 (555) 010-5678', 'Active',        'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=dbe1ff&color=004ac6&bold=true', 18, 3100000,  78, '2021-03-01'),
(4, 'David Chen',      'david.c@drimpact.com', '$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Commercial Lead',        'San Francisco', 'SF Commercial Hub',          '+1 (555) 010-9012', 'On Leave',      'https://ui-avatars.com/api/?name=David+Chen&background=dbe1ff&color=004ac6&bold=true',      15, 5200000,  85, '2019-01-01'),
(5, 'Sarah Chen',      'sarah.c@drimpact.com', '$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Luxury Property Expert', 'Miami Beach',   'Miami Luxury Division',      '+1 (555) 010-3456', 'Active',        'https://ui-avatars.com/api/?name=Sarah+Chen&background=dbe1ff&color=004ac6&bold=true',      21, 7400000,  88, '2022-06-01'),
(6, 'James Wilson',    'james.w@drimpact.com', '$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Commercial Broker',      'Chicago',       'Chicago Loop Office',        '+1 (555) 010-7788', 'Active',        'https://ui-avatars.com/api/?name=James+Wilson&background=dbe1ff&color=004ac6&bold=true',    11, 8000000,  64, '2021-09-01'),
(7, 'Emily Davis',     'emily.d@drimpact.com', '$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Junior Agent',           'Boston',        'Boston Back Bay Office',     '+1 (555) 010-4455', 'Active',        'https://ui-avatars.com/api/?name=Emily+Davis&background=dbe1ff&color=004ac6&bold=true',     6,  1200000,  45, '2023-04-01'),
(8, 'Alex Rivera',     'alex.r@drimpact.com',  '$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Senior Associate',       'New York',      'Upper West Side Office',     '+1 (555) 010-2299', 'Active',        'https://ui-avatars.com/api/?name=Alex+Rivera&background=dbe1ff&color=004ac6&bold=true',     14, 2900000,  71, '2022-01-01'),
(9, 'David Miller',    'david.m@drimpact.com', '$2b$12$HHe3yqGRNFY/AJysVyLppeqhQud4jnBcKV7CzmI1sQdVL.z2JIoYO', 'user',  'Commercial Specialist',  'Chicago',       'Chicago Commercial Desk',    '+1 (555) 010-6611', 'Active',        'https://ui-avatars.com/api/?name=David+Miller&background=dbe1ff&color=004ac6&bold=true',    9,  2100000,  58, '2020-08-01');

-- ── Clients ─────────────────────────────────────────────────────────────────
INSERT INTO clients (id, name, email, phone, type, budget, intent, status, active_deals, closed_deals, avatar_url, joined_at) VALUES
(1,  'Eleanor Pemberton','eleanor.p@icloud.com', '+1 (555) 012-3456', 'Buyer',    '$2.5M - $3.8M', 'High Intent',         'Active',   3, 2,  'https://ui-avatars.com/api/?name=Eleanor+Pemberton&background=dbe1ff&color=004ac6&bold=true', '2024-01-12'),
(2,  'Marcus Thorne',    'm.thorne@vanguard.co', '+1 (555) 987-6543', 'Investor', '$10M - $25M',   'Portfolio Expansion', 'Active',   8, 12, 'https://ui-avatars.com/api/?name=Marcus+Thorne&background=dbe1ff&color=004ac6&bold=true',     '2023-12-05'),
(3,  'Sarah Jenkins',    'sarah.j@outlook.com',  '+1 (555) 234-5678', 'Seller',   '$1.2M - $1.8M', 'Market Listing',      'Pending',  1, 0,  'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=dbe1ff&color=004ac6&bold=true',     '2024-02-14'),
(4,  'Julian Rossi',     'j.rossi@studio.it',    '+1 (555) 345-6789', 'Buyer',    '$800K - $1.1M', 'Financing Review',    'Inactive', 2, 1,  'https://ui-avatars.com/api/?name=Julian+Rossi&background=dbe1ff&color=004ac6&bold=true',      '2023-11-28'),
(5,  'Robert Chen',      'robert.chen@mail.com', '+1 (555) 456-7890', 'Buyer',    '$1M - $1.5M',   'High Intent',         'Active',   1, 0,  'https://ui-avatars.com/api/?name=Robert+Chen&background=dbe1ff&color=004ac6&bold=true',       '2024-03-02'),
(6,  'Liam O''Connell',  'liam.oc@mail.com',     '+1 (555) 567-8901', 'Buyer',    '$3M - $4M',     'Negotiating',         'Active',   1, 0,  'https://ui-avatars.com/api/?name=Liam+OConnell&background=dbe1ff&color=004ac6&bold=true',     '2024-04-18'),
(7,  'Ana Folau',        'ana.folau@mail.com',   '+1 (555) 678-9012', 'Buyer',    '$700K - $800K', 'Closed Won',          'Active',   0, 1,  'https://ui-avatars.com/api/?name=Ana+Folau&background=dbe1ff&color=004ac6&bold=true',         '2024-01-30'),
(8,  'Nexus Corp',       'realestate@nexus.com', '+1 (555) 789-0123', 'Investor', '$8M - $10M',    'Commercial Expansion','Active',   1, 0,  'https://ui-avatars.com/api/?name=Nexus+Corp&background=dbe1ff&color=004ac6&bold=true',        '2024-05-06'),
(9,  'Sheikh Al-Rashid', 'office@alrashid.ae',   '+971 50 123 4567',  'Buyer',    '$40M+',         'VIP Acquisition',     'Active',   1, 0,  'https://ui-avatars.com/api/?name=Sheikh+Al+Rashid&background=dbe1ff&color=004ac6&bold=true',  '2024-06-01'),
(10, 'David Brooks',     'd.brooks@mail.com',    '+1 212 990 8877',   'Buyer',    '$5M+',          'Commercial Interest', 'Pending',  0, 0,  'https://ui-avatars.com/api/?name=David+Brooks&background=dbe1ff&color=004ac6&bold=true',      '2024-05-22');

-- ── Properties ──────────────────────────────────────────────────────────────
INSERT INTO properties (id, code, title, description, location, type, price, price_label, beds, baths, sqft, status, image_url, agent_id, listed_at) VALUES
(1, 'PROP-8241', 'Skyline Penthouse',   'Experience unparalleled luxury in this stunning penthouse located in the heart of downtown. Floor-to-ceiling windows offer panoramic city views, a state-of-the-art chef''s kitchen, and a spa-inspired primary suite.', 'Upper West Side, NY', 'Apartment',  4250000, '$4,250,000', 4, 3, 3200,  'Available', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', 8, '2023-10-12'),
(2, 'PROP-9102', 'Serene Waters Villa', 'A breathtaking waterfront villa with private beach access, infinity pool, and expansive outdoor entertaining spaces across three levels.', 'Miami Beach, FL', 'Villa', 8900000, '$8,900,000', 6, 7, 5800, 'Sold', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', 5, '2023-09-28'),
(3, 'PROP-4452', 'The Hub Plaza',       'Premium commercial plaza in the central business district with flexible floor plans, dedicated parking, and modern building systems.', 'Chicago, IL', 'Commercial', 15500, '$15,500/mo', 0, 4, 12000, 'Rented', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', 9, '2023-11-05');

INSERT INTO property_images (property_id, url, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', 0),
(1, 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', 1),
(1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', 2),
(1, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', 3),
(2, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', 0),
(2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 1),
(2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 2),
(3, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', 0),
(3, 'https://images.unsplash.com/photo-1600566753190-17f0baa5a6cb?w=800&q=80', 1),
(3, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 2);

-- ── Leads ───────────────────────────────────────────────────────────────────
INSERT INTO leads (id, name, email, phone, property_interest, budget, stage, status, source, avatar_url, agent_id, created_at) VALUES
(1,  'Sarah Miller',    'sarah.miller@mail.com', '+1 234 567 890',  'Skyline Penthouse',         '$1.2M - $1.5M', 'Negotiation', 'Hot',  'Website',   'https://ui-avatars.com/api/?name=Sarah+Miller&background=dbe1ff&color=004ac6&bold=true',    2, NOW() - INTERVAL 2 HOUR),
(2,  'Marcus Chen',     'marcus.chen@mail.com',  '+1 987 654 321',  'Luxury Beachfront Villa',   '$4.5M',         'Inquiry',     'Warm', 'Referral',  'https://ui-avatars.com/api/?name=Marcus+Chen&background=dbe1ff&color=004ac6&bold=true',     3, NOW() - INTERVAL 5 HOUR),
(3,  'James Wilson',    'james.w.lead@mail.com', '+1 555 010 888',  'Downtown Modern Loft',      '$850K',         'Closed',      'Hot',  'Website',   'https://ui-avatars.com/api/?name=James+Wilson&background=dbe1ff&color=004ac6&bold=true',    4, NOW() - INTERVAL 1 DAY),
(4,  'Elena Rodriguez', 'elena.r.lead@mail.com', '+1 305 444 2211', 'Family Villa - South Beach','$2.1M',         'Viewing',     'Hot',  'Instagram', 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=dbe1ff&color=004ac6&bold=true', 5, NOW() - INTERVAL 3 HOUR),
(5,  'David Brooks',    'd.brooks@mail.com',     '+1 212 990 8877', 'Office Space - Midtown',    '$5M+',          'Contacted',   'Cold', 'LinkedIn',  'https://ui-avatars.com/api/?name=David+Brooks&background=dbe1ff&color=004ac6&bold=true',    6, NOW() - INTERVAL 1 DAY),
(6,  'Amina Yusuf',     'amina.y@mail.com',      '+1 617 333 9900', 'Modern Studio - Heights',   '$600K - $750K', 'New',         'Warm', 'Website',   'https://ui-avatars.com/api/?name=Amina+Yusuf&background=dbe1ff&color=004ac6&bold=true',     7, NOW() - INTERVAL 1 HOUR),
(7,  'Tom Richards',    'tom.r@mail.com',        '+1 415 888 1122', 'Luxury Condo - Pier 39',    '$3.4M',         'Negotiation', 'Hot',  'Referral',  'https://ui-avatars.com/api/?name=Tom+Richards&background=dbe1ff&color=004ac6&bold=true',    2, NOW() - INTERVAL 2 DAY),
(8,  'Linda Low',       'linda.low@mail.com',    '+1 512 777 5544', 'Suburban Estate',           '$1.8M',         'Viewing',     'Warm', 'Website',   'https://ui-avatars.com/api/?name=Linda+Low&background=dbe1ff&color=004ac6&bold=true',       3, NOW() - INTERVAL 4 HOUR),
(9,  'Kevin Zhang',     'kevin.z@mail.com',      '+1 626 555 4433', 'Industrial Warehouse',      '$2.5M',         'New',         'Cold', 'Cold Call', 'https://ui-avatars.com/api/?name=Kevin+Zhang&background=dbe1ff&color=004ac6&bold=true',     4, NOW() - INTERVAL 5 HOUR),
(10, 'Rachel Green',    'rachel.g@mail.com',     '+1 212 555 0199', 'Townhouse - West Village',  '$4.2M',         'Closed',      'Hot',  'Referral',  'https://ui-avatars.com/api/?name=Rachel+Green&background=dbe1ff&color=004ac6&bold=true',    5, NOW() - INTERVAL 8 HOUR);

INSERT INTO follow_ups (lead_id, due_at, note) VALUES
(1, NOW() + INTERVAL 1 DAY,  'Discuss counter-offer details'),
(4, NOW() + INTERVAL 2 DAY,  'Confirm second viewing appointment'),
(5, NOW() + INTERVAL 3 DAY,  'Send midtown office space brochure'),
(6, NOW() + INTERVAL 1 DAY,  'Initial qualification call');

-- ── Deal pipelines ──────────────────────────────────────────────────────────
INSERT INTO pipelines (id, name, sort_order) VALUES
(1, 'Main Residential', 0),
(2, 'Commercial', 1),
(3, 'Luxury Collection', 2);

INSERT INTO pipeline_columns (id, pipeline_id, name, color, sort_order) VALUES
(1,  1, 'New Deal',      'bg-primary',   0),
(2,  1, 'Negotiation',   'bg-secondary', 1),
(3,  1, 'Booking',       'bg-tertiary',  2),
(4,  1, 'Documentation', 'bg-secondary', 3),
(5,  1, 'Closed',        'bg-tertiary',  4),
(6,  2, 'Prospect',      'bg-secondary', 0),
(7,  2, 'Due Diligence', 'bg-primary',   1),
(8,  2, 'Offer',         'bg-tertiary',  2),
(9,  2, 'Closed',        'bg-tertiary',  3),
(10, 3, 'Discovery',     'bg-primary',   0),
(11, 3, 'Private Tour',  'bg-secondary', 1),
(12, 3, 'Offer',         'bg-tertiary',  2),
(13, 3, 'Closed',        'bg-tertiary',  3);

INSERT INTO deals (id, title, client_id, property_id, column_id, price, priority, stage, notes, image_url, agent_id, outcome, sort_order) VALUES
(1, 'Skyline Penthouse',     5, 1,    1,  1250000,  'High Priority',   'Inquiry',     'Client interested in units above 30th floor.',      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', NULL, 'open', 0),
(2, 'Oakwood Estate',        3, NULL, 1,  890000,   'Normal',          'Inquiry',     'Needs financing pre-approval before proceeding.',   NULL, 5, 'open', 1),
(3, 'Waterfront Villa',      6, NULL, 2,  3450000,  'Payment Pending', 'Negotiation', 'Counter-offer sent. Awaiting client response.',     'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 4, 'open', 0),
(4, 'Mountain Retreat',      7, NULL, 5,  720000,   'Closed Won',      'Closed',      NULL, NULL, 5, 'won', 0),
(5, 'Downtown Office Block', 8, NULL, 6,  8400000,  'High Priority',   'Prospect',    NULL, NULL, NULL, 'open', 0),
(6, 'Private Island Estate', 9, NULL, 10, 42000000, 'VIP',             'Discovery',   NULL, NULL, NULL, 'open', 0);

-- ── Orders ──────────────────────────────────────────────────────────────────
INSERT INTO orders (id, order_number, company, country, bank, branch, request_date, start_date, start_time, assigned_name, availability, action) VALUES
(1, 'JI456M9', 'S&P Credit Mkt SVCS Eurpoe Ltd',    'Russian Federation', 'MBL', 'Hyderi Branch',        '2026-03-26', '2026-03-26', '10:30:00', 'Zaki Javed',     'Online',  'Review'),
(2, 'JI456M9', 'Pharma International',              'Italy',              'UBL', 'Gulshan Branch',       '2026-03-15', '2026-03-15', '10:30:00', 'Asad Chaudhry',  'Online',  'Start'),
(3, 'JI456M9', 'Credit Suisse (Hong Kong) Limited', 'Australia',          'MCB', 'IJ Churidgram Branch', '2026-02-24', '2026-02-24', '10:30:00', 'Khalil Rizvi',   'Online',  'Reuse'),
(4, '4PO78N',  'Targaryen Restoration',             'China',              'MBL', 'Johar Branch',         '2026-02-24', '2026-02-24', '10:30:00', 'Tariq Javed',    'Online',  'Send'),
(5, 'Y98MYO',  'Master Facility',                   'Hong Kong',          'HBL', '3 Talwar Branch',      '2026-02-19', '2026-02-19', '10:30:00', 'Zain Raza',      'Offline', 'Review'),
(6, 'B34KL2',  'Global Trade Partners LLC',         'United Kingdom',     'NBP', 'Karachi Branch',       '2026-02-12', '2026-02-12', '09:15:00', 'Sara Ahmed',     'Online',  'Review'),
(7, 'X91MN5',  'Pacific Rim Industries',            'Japan',              'ABL', 'Clifton Branch',       '2026-02-08', '2026-02-08', '11:00:00', 'Hassan Ali',     'Offline', 'Start'),
(8, 'R67TY9',  'Euro Capital Group',                'Germany',            'SCB', 'DHA Branch',           '2026-02-05', '2026-02-05', '14:00:00', 'Nadia Khan',     'Online',  'Reuse'),
(9, 'M23QP1',  'Nexus Financial Services',          'UAE',                'MCB', 'Gulberg Branch',       '2026-02-01', '2026-02-01', '10:00:00', 'Omer Sheikh',    'Online',  'Send');

-- ── Conversations & messages (owned by admin user) ──────────────────────────
INSERT INTO conversations (id, user_id, client_id, contact_name) VALUES
(1, 1, 1,  'Eleanor Pemberton'),
(2, 1, 2,  'Marcus Thorne'),
(3, 1, 3,  'Sarah Jenkins'),
(4, 1, 4,  'Julian Rossi'),
(5, 1, 10, 'David Brooks');

INSERT INTO messages (conversation_id, direction, body, read_at, created_at) VALUES
(1, 'incoming', 'Hi, is the Skyline Penthouse still available for viewing this weekend?', NULL, NOW() - INTERVAL 34 MINUTE),
(1, 'outgoing', 'Yes Eleanor! It''s still available. Would Saturday at 2 PM work for you?', NOW(), NOW() - INTERVAL 32 MINUTE),
(1, 'incoming', 'Is the penthouse still available?', NULL, NOW() - INTERVAL 30 MINUTE),
(2, 'incoming', 'I''ve reviewed the contract terms. Everything looks good on my end.', NOW(), NOW() - INTERVAL 2 HOUR),
(2, 'outgoing', 'Great! I''ll send the final documents for signature today.', NOW(), NOW() - INTERVAL 110 MINUTE),
(2, 'incoming', 'Contract documents are ready.', NOW(), NOW() - INTERVAL 100 MINUTE),
(3, 'incoming', 'Can we reschedule the viewing?', NULL, NOW() - INTERVAL 1 DAY),
(4, 'incoming', 'Thank you for the update!', NOW(), NOW() - INTERVAL 1 DAY),
(5, 'incoming', 'Interested in the commercial lot.', NOW(), NOW() - INTERVAL 4 DAY);

-- ── Calendar events (owned by admin user) ───────────────────────────────────
INSERT INTO calendar_events (id, user_id, title, event_date, event_time, duration, type, property_name, notes) VALUES
(1, 1, 'Viewing: Skyline Penthouse',           '2026-06-09', '14:00:00', '1 hr',   'Viewing',  'Skyline Penthouse', 'Site viewing with Robert Chen. Show him the rooftop deck.'),
(2, 1, 'Negotiation Meeting: Sarah Jenkins',   '2026-06-12', '10:00:00', '1.5 hr', 'Meeting',  'Oakwood Estate',    'Review final draft contract and deposit terms.'),
(3, 1, 'Follow-up: Julian Rossi',              '2026-06-09', '16:30:00', '30 min', 'Call',     NULL,                'Check on financing pre-approval documents.'),
(4, 1, 'Property Listing Review',              '2026-06-15', '09:00:00', '1 hr',   'Reminder', NULL,                'Update pricing for Malibu Villa.');

-- ── Notifications (for admin user) ──────────────────────────────────────────
INSERT INTO notifications (user_id, title, body, icon, read_at, created_at) VALUES
(1, 'New lead assigned',        'Amina Yusuf was added as a new lead.',                'person_add', NULL, NOW() - INTERVAL 1 HOUR),
(1, 'Deal moved to Negotiation','Waterfront Villa moved to the Negotiation stage.',    'handshake',  NULL, NOW() - INTERVAL 3 HOUR),
(1, 'Viewing scheduled',        'Viewing for Skyline Penthouse on Jun 9, 2:00 PM.',    'event',      NOW(), NOW() - INTERVAL 1 DAY);
