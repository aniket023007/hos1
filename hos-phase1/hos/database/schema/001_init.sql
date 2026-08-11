-- HOS Database Schema — Phase 1
-- Run with: psql -U <user> -d hos -f database/schema/001_init.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- ========== CORE AUTH ==========

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('student', 'warden')),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ========== ROOMS (needed for student profile FK) ==========

CREATE TABLE IF NOT EXISTS rooms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block           VARCHAR(50) NOT NULL,
    room_number     VARCHAR(20) NOT NULL,
    floor           INT NOT NULL,
    capacity        INT NOT NULL DEFAULT 4,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(block, room_number)
);

-- ========== STUDENTS ==========

CREATE TABLE IF NOT EXISTS students (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_code        VARCHAR(50) UNIQUE NOT NULL,
    full_name           VARCHAR(150) NOT NULL,
    phone               VARCHAR(20),
    date_of_birth       DATE,
    gender              VARCHAR(20),
    course              VARCHAR(100),
    department          VARCHAR(100),
    year                INT,
    address             TEXT,
    guardian_name       VARCHAR(150),
    guardian_phone      VARCHAR(20),
    emergency_contact    VARCHAR(20),
    medical_info        TEXT,
    room_id             UUID REFERENCES rooms(id) ON DELETE SET NULL,
    bed_number          INT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_room_id ON students(room_id);

-- ========== WARDENS ==========

CREATE TABLE IF NOT EXISTS wardens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name       VARCHAR(150) NOT NULL,
    phone           VARCHAR(20),
    designation     VARCHAR(100) DEFAULT 'Warden',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wardens_user_id ON wardens(user_id);

-- ========== AUDIT LOG (used from Phase 1 for login events) ==========

CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,
    related_record  VARCHAR(150),
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_students_updated_at ON students;
CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
