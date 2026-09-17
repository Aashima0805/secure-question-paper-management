package com.securequestionpaper.questionpapermanagement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final WebClient webClient = WebClient.builder().build();

    public String uploadFile(String fileName, byte[] fileData) {

        String path = supabaseUrl
                + "/storage/v1/object/"
                + bucket
                + "/"
                + fileName;

        webClient.post()
                .uri(path)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseKey)
                .header("apikey", supabaseKey)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .bodyValue(fileData)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return fileName;
    }
    public byte[] downloadFile(String fileName) {

        String path = supabaseUrl
                + "/storage/v1/object/"
                + bucket
                + "/"
                + fileName;

        return webClient.get()
                .uri(path)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseKey)
                .header("apikey", supabaseKey)
                .retrieve()
                .bodyToMono(byte[].class)
                .block();
    }
}