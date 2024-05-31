USE users;

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    initiator VARCHAR(255),
    date VARCHAR(255),
    token_id VARCHAR(255),
    amount VARCHAR(255),
    issuer VARCHAR(255),
    status VARCHAR(255)
);

INSERT INTO users.transactions (initiator, date, token_id, amount, issuer, status) 
VALUES ('na', 'na', 'na', 'na', 'na', 'na');