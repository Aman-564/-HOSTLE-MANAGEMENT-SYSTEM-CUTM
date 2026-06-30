package com.hostel.management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail() : request.getUsername();
        String password = request.getPassword();

        if ("admin@hostelos.test".equalsIgnoreCase(email) && "Password@123".equals(password)) {
            return ResponseEntity.ok(session("Priya Admin", email, "admin"));
        }
        if ("warden@hostelos.test".equalsIgnoreCase(email) && "Password@123".equals(password)) {
            return ResponseEntity.ok(session("Mr. Kapoor", email, "warden"));
        }
        if ("student@hostelos.test".equalsIgnoreCase(email) && "Password@123".equals(password)) {
            return ResponseEntity.ok(session("Aisha Rao", email, "student"));
        }

        if ("admin".equals(request.getUsername()) && "admin123".equals(password)) {
            return ResponseEntity.ok(session("Hostel Admin", "admin@hostelos.test", "admin"));
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail() : request.getUsername();
        return ResponseEntity.ok(session(request.getName() != null ? request.getName() : "New Student", email, request.getRole() != null ? request.getRole() : "student"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(Map.of("message", "OTP sent for demo account", "otp", "123456"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        boolean verified = "123456".equals(request.get("otp")) || "123456".equals(request.get("code"));
        return verified ? ResponseEntity.ok(Map.of("message", "OTP verified")) : ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
    }

    private Map<String, Object> session(String name, String email, String role) {
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("name", name);
        user.put("email", email);
        user.put("role", role);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", "demo-" + UUID.randomUUID());
        response.put("issuedAt", Instant.now().toString());
        response.put("user", user);
        return response;
    }

    public static class LoginRequest {
        private String username;
        private String email;
        private String password;
        private String name;
        private String role;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
