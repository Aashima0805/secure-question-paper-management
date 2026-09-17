package com.securequestionpaper.questionpapermanagement.util;

import java.security.MessageDigest;

public class FileHashUtil {

    public static String generateHash(byte[] fileBytes) throws Exception {

        MessageDigest digest = MessageDigest.getInstance("SHA-256");

        byte[] hashBytes = digest.digest(fileBytes);

        StringBuilder hash = new StringBuilder();

        for (byte b : hashBytes) {
            hash.append(String.format("%02x", b));
        }

        return hash.toString();
    }
}