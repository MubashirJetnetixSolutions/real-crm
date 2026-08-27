-- ============================================================================
-- EstateX CRM — MySQL 8.x schema
-- Run: mysql -u root estatex_crm < database/schema.sql
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS calendar_events;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS deals;
DROP TABLE IF EXISTS pipeline_columns;
DROP TABLE IF EXISTS pipelines;
DROP TABLE IF EXISTS follow_ups;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ── Users (authentication + team members/agents) ───────────────────────────
CREATE TABLE users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(120)    NOT NULL,
  email          VARCHAR(190)    NOT NULL,
  password_hash  VARCHAR(100)    NOT NULL,
  role           ENUM('admin','user') NOT NULL DEFAULT 'user',
  job_title      VARCHAR(120)    NULL,
  region         VARCHAR(120)    NULL,
  office         VARCHAR(190)    NULL,
  phone          VARCHAR(40)     NULL,
  status         VARCHAR(40)     NOT NULL DEFAULT 'Active',
  avatar_url     TEXT            NULL,
  deals_count    INT UNSIGNED    NOT NULL DEFAULT 0,
  revenue_total  DECIMAL(14,2)   NOT NULL DEFAULT 0,
  performance    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  joined_at      DATE            NULL,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at     TIMESTAMP       NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Password reset tokens ───────────────────────────────────────────────────
CREATE TABLE password_reset_tokens (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  token_hash  CHAR(64)        NOT NULL,
  expires_at  DATETIME        NOT NULL,
  used_at     DATETIME        NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reset_token (token_hash),
  KEY idx_reset_user (user_id),
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Clients ─────────────────────────────────────────────────────────────────
CREATE TABLE clients (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120)    NOT NULL,
  email         VARCHAR(190)    NULL,
  phone         VARCHAR(40)     NULL,
  address       VARCHAR(190)    NULL,
  type          ENUM('Buyer','Investor','Seller') NOT NULL DEFAULT 'Buyer',
  budget        VARCHAR(60)     NULL,
  intent        VARCHAR(80)     NULL,
  status        ENUM('Active','Pending','Inactive') NOT NULL DEFAULT 'Active',
  active_deals  INT UNSIGNED    NOT NULL DEFAULT 0,
  closed_deals  INT UNSIGNED    NOT NULL DEFAULT 0,
  avatar_url    TEXT            NULL,
  joined_at     DATE            NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY idx_clients_type (type),
  KEY idx_clients_status (status),
  KEY idx_clients_deleted (deleted_at),
  KEY idx_clients_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Properties ──────────────────────────────────────────────────────────────
CREATE TABLE properties (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(20)     NOT NULL,
  title        VARCHAR(190)    NOT NULL,
  description  TEXT            NULL,
  location     VARCHAR(190)    NULL,
  address      VARCHAR(190)    NULL,
  type         VARCHAR(60)     NOT NULL DEFAULT 'Apartment',
  price        DECIMAL(14,2)   NOT NULL DEFAULT 0,
  price_label  VARCHAR(60)     NULL,
  beds         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  baths        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  sqft         INT UNSIGNED    NOT NULL DEFAULT 0,
  status       ENUM('Available','Sold','Rented') NOT NULL DEFAULT 'Available',
  image_url    TEXT            NULL,
  agent_id     BIGINT UNSIGNED NULL,
  listed_at    DATE            NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMP       NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_properties_code (code),
  KEY idx_properties_status (status),
  KEY idx_properties_type (type),
  KEY idx_properties_agent (agent_id),
  KEY idx_properties_deleted (deleted_at),
  CONSTRAINT fk_properties_agent FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE property_images (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  property_id  BIGINT UNSIGNED NOT NULL,
  url          TEXT            NOT NULL,
  sort_order   INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_property_images_property (property_id),
  CONSTRAINT fk_property_images_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Leads ───────────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name               VARCHAR(120)    NOT NULL,
  email              VARCHAR(190)    NULL,
  phone              VARCHAR(40)     NULL,
  property_interest  VARCHAR(190)    NULL,
  budget             VARCHAR(60)     NULL,
  preferred_location VARCHAR(190)    NULL,
  notes              TEXT            NULL,
  stage              ENUM('New','Contacted','Inquiry','Viewing','Negotiation','Closed') NOT NULL DEFAULT 'New',
  status             ENUM('Hot','Warm','Cold') NOT NULL DEFAULT 'Warm',
  source             VARCHAR(80)     NULL,
  avatar_url         TEXT            NULL,
  agent_id           BIGINT UNSIGNED NULL,
  created_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at         TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY idx_leads_stage (stage),
  KEY idx_leads_status (status),
  KEY idx_leads_agent (agent_id),
  KEY idx_leads_deleted (deleted_at),
  CONSTRAINT fk_leads_agent FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE follow_ups (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id      BIGINT UNSIGNED NOT NULL,
  due_at       DATETIME        NOT NULL,
  note         VARCHAR(255)    NULL,
  completed_at DATETIME        NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_follow_ups_lead (lead_id),
  KEY idx_follow_ups_due (due_at),
  CONSTRAINT fk_follow_ups_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Deal pipelines (kanban) ─────────────────────────────────────────────────
CREATE TABLE pipelines (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(120)    NOT NULL,
  sort_order INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY idx_pipelines_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pipeline_columns (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  pipeline_id BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(120)    NOT NULL,
  color       VARCHAR(40)     NOT NULL DEFAULT 'bg-primary',
  sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_columns_pipeline (pipeline_id),
  CONSTRAINT fk_columns_pipeline FOREIGN KEY (pipeline_id) REFERENCES pipelines (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE deals (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title       VARCHAR(190)    NOT NULL,
  client_id   BIGINT UNSIGNED NULL,
  property_id BIGINT UNSIGNED NULL,
  column_id   BIGINT UNSIGNED NOT NULL,
  price       DECIMAL(14,2)   NOT NULL DEFAULT 0,
  priority    VARCHAR(40)     NOT NULL DEFAULT 'Normal',
  stage       VARCHAR(60)     NULL,
  notes       TEXT            NULL,
  image_url   TEXT            NULL,
  agent_id    BIGINT UNSIGNED NULL,
  outcome     ENUM('open','won','lost') NOT NULL DEFAULT 'open',
  expected_close_at DATE      NULL,
  sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY idx_deals_column (column_id),
  KEY idx_deals_client (client_id),
  KEY idx_deals_agent (agent_id),
  KEY idx_deals_outcome (outcome),
  KEY idx_deals_deleted (deleted_at),
  CONSTRAINT fk_deals_column FOREIGN KEY (column_id) REFERENCES pipeline_columns (id) ON DELETE CASCADE,
  CONSTRAINT fk_deals_client FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL,
  CONSTRAINT fk_deals_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE SET NULL,
  CONSTRAINT fk_deals_agent FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Orders ──────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number  VARCHAR(20)     NOT NULL,
  company       VARCHAR(190)    NOT NULL,
  country       VARCHAR(90)     NULL,
  bank          VARCHAR(60)     NULL,
  branch        VARCHAR(120)    NULL,
  request_date  DATE            NULL,
  start_date    DATE            NULL,
  start_time    TIME            NULL,
  assigned_name VARCHAR(120)    NULL,
  availability  ENUM('Online','Offline') NOT NULL DEFAULT 'Online',
  action        ENUM('Review','Start','Reuse','Send') NOT NULL DEFAULT 'Review',
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY idx_orders_number (order_number),
  KEY idx_orders_availability (availability),
  KEY idx_orders_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Messaging ───────────────────────────────────────────────────────────────
CREATE TABLE conversations (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  client_id    BIGINT UNSIGNED NULL,
  contact_name VARCHAR(120)    NOT NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY idx_conversations_user (user_id),
  KEY idx_conversations_client (client_id),
  CONSTRAINT fk_conversations_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_conversations_client FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE messages (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  direction       ENUM('outgoing','incoming') NOT NULL,
  body            TEXT            NOT NULL,
  read_at         DATETIME        NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_messages_conversation (conversation_id, created_at),
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Calendar ────────────────────────────────────────────────────────────────
CREATE TABLE calendar_events (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  title         VARCHAR(190)    NOT NULL,
  event_date    DATE            NOT NULL,
  event_time    TIME            NOT NULL,
  duration      VARCHAR(30)     NULL,
  type          ENUM('Viewing','Meeting','Call','Reminder') NOT NULL DEFAULT 'Meeting',
  property_name VARCHAR(190)    NULL,
  notes         TEXT            NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY idx_events_user_date (user_id, event_date),
  CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Notifications ───────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  title      VARCHAR(190)    NOT NULL,
  body       VARCHAR(500)    NULL,
  icon       VARCHAR(40)     NULL,
  read_at    DATETIME        NULL,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user (user_id, read_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Activity log (audit trail) ──────────────────────────────────────────────
CREATE TABLE activity_logs (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NULL,
  action      VARCHAR(60)     NOT NULL,
  entity_type VARCHAR(40)     NULL,
  entity_id   BIGINT UNSIGNED NULL,
  details     JSON            NULL,
  ip          VARCHAR(45)     NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_user (user_id),
  KEY idx_activity_entity (entity_type, entity_id),
  KEY idx_activity_created (created_at),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
