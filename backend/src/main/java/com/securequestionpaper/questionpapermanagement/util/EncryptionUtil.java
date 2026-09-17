
        package com.securequestionpaper.questionpapermanagement.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

@Component
public class EncryptionUtil {

    private final String secretKey;

    public EncryptionUtil(
            @Value("${encryption.secret-key}") String secretKey) {
        this.secretKey = secretKey;
    }

    public byte[] encrypt(byte[] data) throws Exception {

        SecretKeySpec key = new SecretKeySpec(
                secretKey.getBytes(StandardCharsets.UTF_8),
                "AES"
        );

        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");

        GCMParameterSpec spec =
                new GCMParameterSpec(128, iv);

        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        byte[] encryptedData = cipher.doFinal(data);

        byte[] result = new byte[iv.length + encryptedData.length];

        System.arraycopy(
                iv, 0,
                result, 0,
                iv.length
        );

        System.arraycopy(
                encryptedData, 0,
                result, iv.length,
                encryptedData.length
        );

        return result;
    }

    public byte[] decrypt(byte[] encryptedData) throws Exception {

        SecretKeySpec key = new SecretKeySpec(
                secretKey.getBytes(StandardCharsets.UTF_8),
                "AES"
        );

        byte[] iv = new byte[12];

        System.arraycopy(
                encryptedData,
                0,
                iv,
                0,
                12
        );

        byte[] actualEncryptedData =
                new byte[encryptedData.length - 12];

        System.arraycopy(
                encryptedData,
                12,
                actualEncryptedData,
                0,
                actualEncryptedData.length
        );

        Cipher cipher =
                Cipher.getInstance("AES/GCM/NoPadding");

        GCMParameterSpec spec =
                new GCMParameterSpec(128, iv);

        cipher.init(
                Cipher.DECRYPT_MODE,
                key,
                spec
        );

        return cipher.doFinal(actualEncryptedData);
    }
}
