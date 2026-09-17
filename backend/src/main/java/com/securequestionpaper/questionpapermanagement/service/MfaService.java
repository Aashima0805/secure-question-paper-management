package com.securequestionpaper.questionpapermanagement.service;

import com.securequestionpaper.questionpapermanagement.entity.SecuritySetting;
import com.securequestionpaper.questionpapermanagement.entity.User;
import com.securequestionpaper.questionpapermanagement.repository.SecuritySettingRepository;
import com.securequestionpaper.questionpapermanagement.repository.UserRepository;
import com.securequestionpaper.questionpapermanagement.util.OtpUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MfaService {

    private final UserRepository userRepository;
    private final SecuritySettingRepository securitySettingRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public MfaService(
            UserRepository userRepository,
            SecuritySettingRepository securitySettingRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            AuditLogService auditLogService) {

        this.userRepository = userRepository;
        this.securitySettingRepository = securitySettingRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    public boolean generateOtp(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return false;
        }

        String otp = OtpUtil.generateOtp();
        String hashedOtp = passwordEncoder.encode(otp);

        user.setOtp(hashedOtp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        emailService.sendOtpEmail(email, otp);

        return true;
    }

    public boolean verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || user.getOtp() == null) {
            return false;
        }

        if (user.getOtpExpiry() == null ||
                LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return false;
        }

        if (!passwordEncoder.matches(otp, user.getOtp())) {
            return false;
        }

        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return true;
    }

    public boolean isMfaRequired(User user) {

        if (user.getRole().equals("ADMIN")) {
            return true;
        }

        SecuritySetting setting =
                securitySettingRepository.findById(1L).orElse(null);

        if (setting == null) {
            return false;
        }

        return setting.isMfaEnabled();
    }

    public void logFailedLogin(String email) {

        auditLogService.log(
                "LOGIN_FAILED",
                email,
                null
        );
    }
}