-- Schema additions for Admin features

CREATE TABLE IF NOT EXISTS notices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    active TINYINT(1) NOT NULL DEFAULT 1,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rewards_config (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    enabled TINYINT(1) NOT NULL DEFAULT 0,
    reward_type VARCHAR(80) NOT NULL DEFAULT 'amazon_gift_card',
    reward_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    eligibility_rules JSON NULL,
    disclaimer TEXT NOT NULL,
    appreciation_enabled TINYINT(1) NOT NULL DEFAULT 0,
    updated_by BIGINT UNSIGNED NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rewards (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    claim_id INT UNSIGNED NULL,
    policy_reference VARCHAR(100) NULL,
    reward_type VARCHAR(80) NOT NULL,
    reward_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status ENUM('pending', 'approved', 'rejected', 'issued') NOT NULL DEFAULT 'pending',
    admin_notes TEXT NULL,
    rejection_reason TEXT NULL,
    issue_reference VARCHAR(100) NULL,
    program_type VARCHAR(50) NOT NULL DEFAULT 'request',
    gift_type VARCHAR(150) NULL,
    gift_value_inr DECIMAL(12,2) NULL,
    shipping_status VARCHAR(50) NULL,
    courier VARCHAR(100) NULL,
    awb VARCHAR(100) NULL,
    delivered_at TIMESTAMP NULL DEFAULT NULL,
    admin_remarks TEXT NULL,
    decided_by BIGINT UNSIGNED NULL,
    decided_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rewards_audit_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reward_id INT UNSIGNED NULL,
    config_id INT UNSIGNED NULL,
    actor_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    before_state JSON NULL,
    after_state JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invoices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    claim_id INT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    base_amount_paise BIGINT NOT NULL,
    gst_paise BIGINT NOT NULL,
    total_paise BIGINT NOT NULL,
    status ENUM('issued', 'paid', 'overdue') NOT NULL DEFAULT 'issued',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL DEFAULT NULL,
    payment_reference VARCHAR(100) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS defaulters (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    first_flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_outstanding_paise BIGINT NOT NULL DEFAULT 0,
    last_reminder_at TIMESTAMP NULL DEFAULT NULL,
    reminder_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS promo_codes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    discount_type ENUM('percent', 'flat') NOT NULL,
    discount_value INT NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    max_uses INT NULL,
    times_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default rewards config if empty
INSERT INTO rewards_config (enabled, reward_type, reward_value, currency, eligibility_rules, disclaimer)
SELECT 0, 'amazon_gift_card', 0.00, 'INR', '{"policy_active": true, "kyc_completed": true, "no_fraud_flags": true, "free_look_completed": true, "no_cancellation": true, "min_days_after_issuance": 30}', 'Rewards disclaimer text'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM rewards_config);
