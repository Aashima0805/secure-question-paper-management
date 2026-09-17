
        package com.securequestionpaper.questionpapermanagement.service;

import com.securequestionpaper.questionpapermanagement.entity.AuditLog;
import com.securequestionpaper.questionpapermanagement.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(
            String action,
            String userEmail,
            Long questionPaperId) {

        AuditLog auditLog = new AuditLog();

        auditLog.setAction(action);
        auditLog.setUserEmail(userEmail);
        auditLog.setQuestionPaperId(questionPaperId);
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);
    }
}
