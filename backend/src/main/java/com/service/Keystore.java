package com.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import java.security.Key;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.Base64;
import java.util.Enumeration;

import javax.crypto.KeyGenerator;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Keystore {
    
    private static final String KEYSTORE_PATH = "keystore.jks";
    private static final String KEYSTORE_PASSWORD = "keystorepassword";
    private static final char[] password = KEYSTORE_PASSWORD.toCharArray();

    @Scheduled(fixedDelay = 86400000)
    public static void ScheduledKeyGenerator() {
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

            Key key = generateSymmetricKey();
            String alias = generateRandomAlias();

            keyStore.setKeyEntry(alias, key, password, null);

            try (FileOutputStream fos = new FileOutputStream(KEYSTORE_PATH)) {
                keyStore.store(fos, password);
                System.out.println("KeyStore file saved successfully.");
                }
            
            Enumeration<String> aliases = keyStore.aliases();
            while (aliases.hasMoreElements()) {
                String queriedAlias = aliases.nextElement();
                Key retrievedKey = keyStore.getKey(queriedAlias, password);
                System.out.println("Retrieved Key: " + retrievedKey + " with following alias: " + queriedAlias);
                }

            } catch (UnrecoverableKeyException | KeyStoreException | NoSuchAlgorithmException | CertificateException | java.io.IOException e) {
                e.printStackTrace();
            }
    }
    
    private static String generateRandomAlias() {
        SecureRandom random = new SecureRandom();
        byte[] aliasBytes = new byte[16];
        random.nextBytes(aliasBytes);
        return Base64.getEncoder().encodeToString(aliasBytes);
    }

    private static Key generateSymmetricKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        return keyGen.generateKey();
    }

    public static void deleteKeyByAlias(String alias) {
        KeyStore keyStore;
        
        try {
            keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            File keystoreFile = new File(KEYSTORE_PATH);
            
            if (keystoreFile.exists()) {
                try (FileInputStream fis = new FileInputStream(keystoreFile)) {
                    keyStore.load(fis, password);
                }
                keyStore.deleteEntry(alias);
                System.out.println("Key with alias "+ alias +" successfully deleted");
            } else {
                System.out.println("Keystore file not found at: " + KEYSTORE_PATH);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
    }
    
    public static Key retrieveKeyByAlias(String alias) {
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
}
