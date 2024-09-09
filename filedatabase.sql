
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('company_account', 'member', 'admin') NOT NULL,
    image VARCHAR(255),
    dob DATE,
    status ENUM('active', 'pending') NOT NULL DEFAULT 'active',
    phone VARCHAR(20)
);

CREATE TABLE company_account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(255) NOT NULL,
    number_of_users INT DEFAULT 0,
    status ENUM('active', 'pending'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE topic (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    post_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    post_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    author_id INT,
    status ENUM('resolved', 'not_resolved', 'deleted_by_admin', 'deleted_by_company_account') NOT NULL,
    tag_id INT,
    topic_id INT,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id),
    FOREIGN KEY (topic_id) REFERENCES topic(id)
);

