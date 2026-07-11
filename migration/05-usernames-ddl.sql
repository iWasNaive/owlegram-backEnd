CREATE TABLE IF NOT EXISTS usernames_registry (
    username VARCHAR(255) PRIMARY KEY,
    entity_type ENUM('user', 'group', 'channel') NOT NULL,
    entity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);