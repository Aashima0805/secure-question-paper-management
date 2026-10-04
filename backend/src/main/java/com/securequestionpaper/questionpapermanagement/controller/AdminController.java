package com.securequestionpaper.questionpapermanagement.controller;

import com.securequestionpaper.questionpapermanagement.entity.AuditLog;
import com.securequestionpaper.questionpapermanagement.entity.User;
import com.securequestionpaper.questionpapermanagement.repository.AuditLogRepository;
import com.securequestionpaper.questionpapermanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminController(
            UserRepository userRepository,
            AuditLogRepository auditLogRepository) {

        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> assignRole(
            @PathVariable Long id,
            @RequestParam String role,
            Authentication authentication) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (!role.equals("USER")
                && !role.equals("QUESTION_SETTER")
                && !role.equals("REVIEWER")
                && !role.equals("APPROVER")
                && !role.equals("EXAM_CENTER")) {

            return ResponseEntity.badRequest()
                    .body("Invalid role");
        }

        if (user.getRole().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body("ADMIN role cannot be changed");
        }

        user.setRole(role);
        userRepository.save(user);

        AuditLog auditLog = new AuditLog();

        auditLog.setAction(
                "ROLE_ASSIGNED_" + role + "_TO_" + user.getEmail()
        );

        auditLog.setUserEmail(authentication.getName());
        auditLog.setQuestionPaperId(null);
        auditLog.setTimestamp(java.time.LocalDateTime.now());

        auditLogRepository.save(auditLog);

        return ResponseEntity.ok(
                "Role assigned successfully"
        );
    }
}