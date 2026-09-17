package com.securequestionpaper.questionpapermanagement.repository;

import com.securequestionpaper.questionpapermanagement.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

        List<AuditLog> findAllByOrderByTimestampDesc();
}