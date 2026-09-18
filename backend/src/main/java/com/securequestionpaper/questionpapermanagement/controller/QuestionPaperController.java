package com.securequestionpaper.questionpapermanagement.controller;

import com.securequestionpaper.questionpapermanagement.entity.QuestionPaper;
import com.securequestionpaper.questionpapermanagement.repository.QuestionPaperRepository;
import com.securequestionpaper.questionpapermanagement.service.SupabaseStorageService;
import com.securequestionpaper.questionpapermanagement.util.EncryptionUtil;
import com.securequestionpaper.questionpapermanagement.util.FileHashUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.LocalDateTime;
import com.securequestionpaper.questionpapermanagement.service.AuditLogService;
import org.springframework.security.core.Authentication;
@RestController
@RequestMapping("/api/question-papers")
public class QuestionPaperController {

    private final QuestionPaperRepository questionPaperRepository;
    private final SupabaseStorageService storageService;
    private final AuditLogService auditLogService;
    private final EncryptionUtil encryptionUtil;
    public QuestionPaperController(
            QuestionPaperRepository questionPaperRepository,
            SupabaseStorageService storageService,
            AuditLogService auditLogService,
            EncryptionUtil encryptionUtil) {
        this.questionPaperRepository = questionPaperRepository;
        this.storageService = storageService;
        this.auditLogService = auditLogService;
        this.encryptionUtil = encryptionUtil;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadQuestionPaper(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {


        try {

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }

            byte[] originalFile = file.getBytes();

            String fileHash = FileHashUtil.generateHash(originalFile);

            byte[] encryptedFile = encryptionUtil.encrypt(originalFile);

            String fileName = System.currentTimeMillis()
                    + "_" + file.getOriginalFilename();

            storageService.uploadFile(fileName, encryptedFile);

            QuestionPaper questionPaper = new QuestionPaper();

            questionPaper.setTitle(title);
            questionPaper.setFileName(file.getOriginalFilename());
            questionPaper.setStoragePath(fileName);
            questionPaper.setFileHash(fileHash);
            questionPaper.setStatus("PENDING_REVIEW");
            questionPaper.setCreatedAt(LocalDateTime.now());

            QuestionPaper savedPaper = questionPaperRepository.save(questionPaper);
            auditLogService.log(
                    "QUESTION_PAPER_UPLOADED",
                    authentication.getName(),
                    savedPaper.getId()
            );
            return ResponseEntity.ok(savedPaper);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error uploading question paper");
        }
    }
    @PostMapping("/review")
    public ResponseEntity<?> reviewQuestionPaper(
            @RequestParam("id") Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "remarks", required = false) String remarks,
            Authentication authentication) {

        QuestionPaper questionPaper =
                questionPaperRepository.findById(id).orElse(null);

        if (questionPaper == null) {
            return ResponseEntity.notFound().build();
        }

        if (!questionPaper.getStatus().equals("PENDING_REVIEW")) {
            return ResponseEntity.badRequest()
                    .body("Question paper is not pending review");
        }

        if (!status.equals("REVIEWED") && !status.equals("REJECTED")) {
            return ResponseEntity.badRequest()
                    .body("Status must be REVIEWED or REJECTED");
        }

        if (status.equals("REJECTED")) {

            if (remarks == null || remarks.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Rejection reason is required");
            }

            questionPaper.setReviewRemarks(remarks.trim());

        } else {

            questionPaper.setReviewRemarks(null);
        }

        questionPaper.setStatus(status);

        QuestionPaper updatedPaper =
                questionPaperRepository.save(questionPaper);

        auditLogService.log(
                "QUESTION_PAPER_" + status,
                authentication.getName(),
                id
        );

        return ResponseEntity.ok(updatedPaper);
    }
    @PostMapping("/approve")
    public ResponseEntity<?> approveQuestionPaper(
            @RequestParam("id") Long id,
            @RequestParam("action") String action,
            Authentication authentication) {

        QuestionPaper questionPaper =
                questionPaperRepository.findById(id).orElse(null);

        if (questionPaper == null) {
            return ResponseEntity.notFound().build();
        }

        if (!questionPaper.getStatus().equals("REVIEWED")) {
            return ResponseEntity.badRequest()
                    .body("Question paper must be reviewed before approval or rejection");
        }

        if (!action.equals("APPROVE") && !action.equals("REJECT")) {
            return ResponseEntity.badRequest()
                    .body("Action must be APPROVE or REJECT");
        }

        if (action.equals("APPROVE")) {

            questionPaper.setStatus("APPROVED");

            auditLogService.log(
                    "QUESTION_PAPER_APPROVED",
                    authentication.getName(),
                    id
            );

        } else {

            questionPaper.setStatus("REJECTED");

            auditLogService.log(
                    "QUESTION_PAPER_REJECTED",
                    authentication.getName(),
                    id
            );
        }

        QuestionPaper updatedPaper =
                questionPaperRepository.save(questionPaper);

        return ResponseEntity.ok(updatedPaper);
    }
    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleRelease(
            @RequestParam("id") Long id,
            @RequestParam("releaseTime") String releaseTime,
            Authentication authentication) {

        try {
            QuestionPaper questionPaper =
                    questionPaperRepository.findById(id).orElse(null);

            if (questionPaper == null) {
                return ResponseEntity.notFound().build();
            }

            if (!questionPaper.getStatus().equals("APPROVED")) {
                return ResponseEntity.badRequest()
                        .body("Question paper must be approved before scheduling");
            }

            LocalDateTime scheduledTime =
                    LocalDateTime.parse(releaseTime);

            if (scheduledTime.isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                        .body("Release time must be in the future");
            }

            questionPaper.setScheduledReleaseTime(scheduledTime);

            QuestionPaper updatedPaper =
                    questionPaperRepository.save(questionPaper);
            auditLogService.log(
                    "QUESTION_PAPER_SCHEDULED",
                    authentication.getName(),
                    id
            );
            return ResponseEntity.ok(updatedPaper);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Invalid release time");
        }
    }
    @GetMapping("/review")
public ResponseEntity<?> getPendingReviewPapers() {

    return ResponseEntity.ok(
            questionPaperRepository.findByStatus("PENDING_REVIEW")
    );
}
    @GetMapping("/review/{id}")
    public ResponseEntity<?> viewQuestionPaperForReview(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            QuestionPaper questionPaper =
                    questionPaperRepository.findById(id).orElse(null);

            if (questionPaper == null) {
                return ResponseEntity.notFound().build();
            }

            if (!questionPaper.getStatus().equals("PENDING_REVIEW")) {
                return ResponseEntity.badRequest()
                        .body("Question paper is not pending review");
            }

            byte[] encryptedFile =
                    storageService.downloadFile(questionPaper.getStoragePath());

            byte[] decryptedFile =
                    encryptionUtil.decrypt(encryptedFile);

            String downloadedHash =
                    FileHashUtil.generateHash(decryptedFile);

            if (!downloadedHash.equals(questionPaper.getFileHash())) {
                return ResponseEntity.status(500)
                        .body("File integrity verification failed");
            }

            auditLogService.log(
                    "QUESTION_PAPER_VIEWED_FOR_REVIEW",
                    authentication.getName(),
                    id
            );

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    questionPaper.getFileName() + "\""
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(decryptedFile);

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Error viewing question paper");
        }
    }
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadQuestionPaper(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            QuestionPaper questionPaper =
                    questionPaperRepository.findById(id).orElse(null);

            if (questionPaper == null) {
                return ResponseEntity.notFound().build();
            }

            if (!questionPaper.getStatus().equals("APPROVED")) {
                return ResponseEntity.status(403)
                        .body("Question paper is not approved");
            }

            if (questionPaper.getScheduledReleaseTime() == null) {
                return ResponseEntity.status(403)
                        .body("Question paper release time is not scheduled");
            }

            if (LocalDateTime.now()
                    .isBefore(questionPaper.getScheduledReleaseTime())) {

                return ResponseEntity.status(403)
                        .body("Question paper is not yet released");
            }

            byte[] encryptedFile =
                    storageService.downloadFile(questionPaper.getStoragePath());

            byte[] decryptedFile =
                    encryptionUtil.decrypt(encryptedFile);

            String downloadedHash =
                    FileHashUtil.generateHash(decryptedFile);

            if (!downloadedHash.equals(questionPaper.getFileHash())) {
                return ResponseEntity.status(500)
                        .body("File integrity verification failed");
            }

            auditLogService.log(
                    "QUESTION_PAPER_DOWNLOADED",
                    authentication.getName(),
                    id
            );

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    questionPaper.getFileName() + "\""
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(decryptedFile);

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Error downloading question paper: " + e.getMessage());
        }
    }
}