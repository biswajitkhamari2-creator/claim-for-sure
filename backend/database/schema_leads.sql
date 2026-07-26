CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    insurance_company VARCHAR(255) DEFAULT NULL,
    claim_type VARCHAR(50) DEFAULT NULL,
    claim_status VARCHAR(50) DEFAULT NULL,
    description TEXT,
    rejection_letter_path VARCHAR(255) DEFAULT NULL,
    status ENUM('New', 'Contacted', 'In Progress', 'Closed') DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
