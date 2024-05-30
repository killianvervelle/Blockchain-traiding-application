package com.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Enumeration;
import java.util.List;

import javax.crypto.KeyGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.model.IssuanceRequest;
import com.repo.IssuanceRequestRepository;

// Component class to manage the keystore of encryption/decryption keys
@Component
public class Keystore {

    @Autowired
    private IssuanceRequestRepository issuanceRequestRepository;

    private static final String KEYSTORE_PATH = "backend/src/keystore.jks";
    private static final String KEYSTORE_PASSWORD = "keystorepassword";
    private static final char[] password = KEYSTORE_PASSWORD.toCharArray();

    private Key currentKey;

    // Scheduled method to generate and manage keys
    @Scheduled(fixedDelay = 86400000)
    public void ScheduledKeyGenerator() {
        try {
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            File keystoreFile = new File(KEYSTORE_PATH);
            if (keystoreFile.exists()) {
                try (FileInputStream fis = new FileInputStream(keystoreFile)) {
                    keyStore.load(fis, password);
                }
            } else {
                keyStore.load(null, password);
                System.out.println("KeyStore file created successfully.");
            }
            // Retrieve the last key to decrypt data before re-encrypting it with the new key.
            Enumeration<String> aliases = keyStore.aliases();
            String lastAlias = null;
            while (aliases.hasMoreElements()) {
                lastAlias = aliases.nextElement();
            }
            Key lastKey = keyStore.getKey(lastAlias, KEYSTORE_PASSWORD.toCharArray());
            System.out.println("Last Retrieved Key: " + lastKey + " with following alias: " + lastAlias);
            Key newKey = generateSymmetricKey();
            String alias = generateRandomAlias();
            System.out.println("New Key: " + newKey + " with following alias: " + alias);
            reEncryptData(lastKey, newKey);
            System.out.println("Data succcessfully re-encrypted with new key");
            // Empty keystore
            keyStore.load(null, null);
            // Add new key
            keyStore.setKeyEntry(alias, newKey, password, null);   
            setCurrentKey(newKey);
            try (FileOutputStream fos = new FileOutputStream(KEYSTORE_PATH)) {
                keyStore.store(fos, password);
                System.out.println("KeyStore file saved successfully.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Method to re-encrypt all the data from the initiator and amount tables in the database when a new key is issued.
    private void reEncryptData(Key lastKey, Key newKey) throws Exception {
        // Fetch data from the database (initiator and amount)
        List<IssuanceRequest> ListIssuanceRequest = issuanceRequestRepository.findAll();
        // Re-encrypt initiator and amount data with the new key
        for (IssuanceRequest issuanceRequest : ListIssuanceRequest) {
            String initiator = issuanceRequest.getInitiator();
            String amount = issuanceRequest.getAmount();
            String decryptedInitiator = AESEncryption.decrypt(initiator, lastKey);
            String decryptedAmount  = AESEncryption.decrypt(amount, lastKey);
            String re_encryptedInitiator = AESEncryption.encrypt(decryptedInitiator, newKey);
            String re_encryptedAmount = AESEncryption.encrypt(decryptedAmount, newKey);
            issuanceRequest.setInitiator(re_encryptedInitiator);
            issuanceRequest.setAmount(re_encryptedAmount);
            // Update the database with the newly re-encrypted data
            issuanceRequestRepository.save(issuanceRequest);
        }
    }

    // Method to generate a random alias for a key
    private String generateRandomAlias() {
        SecureRandom random = new SecureRandom();
        byte[] aliasBytes = new byte[16];
        random.nextBytes(aliasBytes);
        return Base64.getEncoder().encodeToString(aliasBytes);
    }

    // Method to generate a symmetric key
    private Key generateSymmetricKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        return keyGen.generateKey();
    }

    // Method to delete a key by its alias
    public void deleteKeyByAlias(String alias) {
        KeyStore keyStore;
        try {
            keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            File keystoreFile = new File(KEYSTORE_PATH);
            if (keystoreFile.exists()) {
                try (FileInputStream fis = new FileInputStream(keystoreFile)) {
                    keyStore.load(fis, password);
                }
                keyStore.deleteEntry(alias);
                System.out.println("Key with alias " + alias + " successfully deleted");
            } else {
                System.out.println("Keystore file not found at: " + KEYSTORE_PATH);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Method to retrieve a key by its alias
    public Key retrieveKeyByAlias(String alias) {
        KeyStore keyStore;
        Key retrievedKey = null;
        try {
            keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            File keystoreFile = new File(KEYSTORE_PATH);
            if (keystoreFile.exists()) {
                try (FileInputStream fis = new FileInputStream(keystoreFile)) {
                    keyStore.load(fis, password);
                }
                retrievedKey = keyStore.getKey(alias, password);
                if (retrievedKey != null) {
                    System.out.println("Retrieved key: " + retrievedKey.toString());
                } else {
                    System.out.println("Failed to retrieve key with the alias: " + alias);
                }
            } else {
                System.out.println("Keystore file not found at: " + KEYSTORE_PATH);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return retrievedKey;
    }

    // Method to fetch current crypto key
    public Key getCurrentKey() {
        return currentKey;
    }

    // Method to set crypto key
    private void setCurrentKey(Key key) {
        this.currentKey = key;
    }
}
