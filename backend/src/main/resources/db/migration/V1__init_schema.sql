-- V1: initial EventFund schema

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE events (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    event_date  DATE         NOT NULL,
    location    VARCHAR(255),
    owner_id    BIGINT       NOT NULL REFERENCES users (id),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_owner_id ON events (owner_id);

CREATE TABLE event_members (
    id         BIGSERIAL PRIMARY KEY,
    event_id   BIGINT      NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    user_id    BIGINT      NOT NULL REFERENCES users (id),
    role       VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_event_members_event_user UNIQUE (event_id, user_id),
    CONSTRAINT ck_event_members_role CHECK (role IN ('OWNER', 'EDITOR', 'VIEWER'))
);

-- event_id is covered by the unique (event_id, user_id) index
CREATE INDEX idx_event_members_user_id ON event_members (user_id);

CREATE TABLE invitations (
    id         BIGSERIAL PRIMARY KEY,
    event_id   BIGINT       NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    email      VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL,
    token      VARCHAR(100) NOT NULL,
    status     VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_invitations_token UNIQUE (token), -- also serves as the token index
    CONSTRAINT ck_invitations_role CHECK (role IN ('EDITOR', 'VIEWER')),
    CONSTRAINT ck_invitations_status CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'))
);

CREATE INDEX idx_invitations_event_id ON invitations (event_id);

CREATE TABLE incomes (
    id            BIGSERIAL PRIMARY KEY,
    event_id      BIGINT        NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    date          DATE          NOT NULL,
    amount        NUMERIC(14,2) NOT NULL,
    description   VARCHAR(500)  NOT NULL,
    received_from VARCHAR(200)  NOT NULL,
    file_path     VARCHAR(500),
    created_by    BIGINT        NOT NULL REFERENCES users (id),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_incomes_amount CHECK (amount > 0)
);

-- event_id is covered by the (event_id, date) index
CREATE INDEX idx_incomes_event_id_date ON incomes (event_id, date);
CREATE INDEX idx_incomes_created_by ON incomes (created_by);

CREATE TABLE expenses (
    id          BIGSERIAL PRIMARY KEY,
    event_id    BIGINT        NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    date        DATE          NOT NULL,
    amount      NUMERIC(14,2) NOT NULL,
    description VARCHAR(500)  NOT NULL,
    paid_to     VARCHAR(200)  NOT NULL,
    file_path   VARCHAR(500),
    created_by  BIGINT        NOT NULL REFERENCES users (id),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_expenses_amount CHECK (amount > 0)
);

CREATE INDEX idx_expenses_event_id_date ON expenses (event_id, date);
CREATE INDEX idx_expenses_created_by ON expenses (created_by);
