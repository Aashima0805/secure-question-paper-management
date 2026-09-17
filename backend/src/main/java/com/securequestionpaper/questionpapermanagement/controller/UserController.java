
        package com.securequestionpaper.questionpapermanagement.controller;

import com.securequestionpaper.questionpapermanagement.dto.LoginRequest;
import com.securequestionpaper.questionpapermanagement.dto.OtpVerificationRequest;
import com.securequestionpaper.questionpapermanagement.entity.User;
import com.securequestionpaper.questionpapermanagement.repository.UserRepository;
import com.securequestionpaper.questionpapermanagement.service.MfaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import com.securequestionpaper.questionpapermanagement.service.JwtService;
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MfaService mfaService;
    private final JwtService jwtService;
    public UserController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            MfaService mfaService,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mfaService = mfaService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            mfaService.logFailedLogin(request.getEmail());

            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            mfaService.logFailedLogin(request.getEmail());

            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        if (mfaService.isMfaRequired(user)) {

            mfaService.generateOtp(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "OTP verification required");
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);
        }

        return loginSuccessResponse(user);
    }



    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody OtpVerificationRequest request) {

        boolean valid = mfaService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!valid) {
            return ResponseEntity.status(401)
                    .body("Invalid or expired OTP");
        }

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("User not found");
        }

        if (!mfaService.isMfaRequired(user)) {
            return ResponseEntity.status(403)
                    .body("MFA is not required for this user");
        }

        return loginSuccessResponse(user);
    }

    private ResponseEntity<?> loginSuccessResponse(User user) {

        Map<String, Object> response = new HashMap<>();
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
        response.put("message", "Login successful");
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

}
