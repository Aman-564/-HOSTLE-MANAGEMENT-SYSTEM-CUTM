package com.hostel.management.controller;

import org.springframework.http.ResponseEntity;

public final class AdminAccess {
    private AdminAccess() {}

    public static boolean isAdmin(String role) {
        return "ADMIN".equalsIgnoreCase(role);
    }

    public static ResponseEntity<String> forbidden() {
        return ResponseEntity.status(403).body("Only admin can modify hostel records");
    }
}
