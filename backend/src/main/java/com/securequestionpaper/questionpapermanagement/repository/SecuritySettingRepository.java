package com.securequestionpaper.questionpapermanagement.repository;

import com.securequestionpaper.questionpapermanagement.entity.SecuritySetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecuritySettingRepository
        extends JpaRepository<SecuritySetting, Long> {
}