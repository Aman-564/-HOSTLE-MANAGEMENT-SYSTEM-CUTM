package com.hostel.management.controller;

import com.hostel.management.entity.*;
import com.hostel.management.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class OperationsController {
    private final StudentRepository students;
    private final RoomRepository rooms;
    private final PaymentRepository payments;
    private final ComplaintRepository complaints;
    private final NoticeRepository notices;
    private final LeaveRequestRepository leaves;
    private final VisitorRepository visitors;
    private final AttendanceRepository attendance;
    private final MessMenuRepository messMenu;
    private final SecurityLogRepository securityLogs;

    public OperationsController(StudentRepository students, RoomRepository rooms, PaymentRepository payments,
                                ComplaintRepository complaints, NoticeRepository notices, LeaveRequestRepository leaves,
                                VisitorRepository visitors, AttendanceRepository attendance, MessMenuRepository messMenu,
                                SecurityLogRepository securityLogs) {
        this.students = students;
        this.rooms = rooms;
        this.payments = payments;
        this.complaints = complaints;
        this.notices = notices;
        this.leaves = leaves;
        this.visitors = visitors;
        this.attendance = attendance;
        this.messMenu = messMenu;
        this.securityLogs = securityLogs;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true, "service", "hostel-management-api");
    }

    @GetMapping("/analytics/summary")
    public Map<String, Object> analytics() {
        int capacity = rooms.findAll().stream().mapToInt(Room::getCapacity).sum();
        int occupied = rooms.findAll().stream().mapToInt(Room::getCurrentOccupancy).sum();
        int occupancyRate = capacity == 0 ? 0 : Math.round((occupied * 100f) / capacity);
        return Map.of(
                "students", students.count(),
                "rooms", rooms.count(),
                "payments", payments.count(),
                "complaintsOpen", complaints.countByStatus("OPEN"),
                "pendingLeaves", leaves.countByStatus("PENDING"),
                "capacity", capacity,
                "occupied", occupied,
                "occupancyRate", occupancyRate
        );
    }

    @GetMapping("/complaints") public Iterable<Complaint> complaints() { return complaints.findAll(); }
    @PostMapping("/complaints") public Complaint saveComplaint(@RequestBody Complaint body) { return complaints.save(body); }
    @PutMapping("/complaints/{id}") public ResponseEntity<Complaint> updateComplaint(@PathVariable Long id, @RequestBody Complaint body) {
        body.setId(id);
        return ResponseEntity.ok(complaints.save(body));
    }

    @GetMapping("/notices") public Iterable<Notice> notices() { return notices.findAll(); }
    @PostMapping("/notices") public Notice saveNotice(@RequestBody Notice body) { return notices.save(body); }

    @GetMapping("/leave-requests") public Iterable<LeaveRequest> leaves() { return leaves.findAll(); }
    @PostMapping("/leave-requests") public LeaveRequest saveLeave(@RequestBody LeaveRequest body) { return leaves.save(body); }
    @PutMapping("/leave-requests/{id}") public ResponseEntity<LeaveRequest> updateLeave(@PathVariable Long id, @RequestBody LeaveRequest body) {
        body.setId(id);
        return ResponseEntity.ok(leaves.save(body));
    }

    @GetMapping("/visitors") public Iterable<Visitor> visitors() { return visitors.findAll(); }
    @PostMapping("/visitors") public Visitor saveVisitor(@RequestBody Visitor body) { return visitors.save(body); }

    @GetMapping("/attendance") public Iterable<Attendance> attendance() { return attendance.findAll(); }
    @PostMapping("/attendance") public Attendance saveAttendance(@RequestBody Attendance body) { return attendance.save(body); }

    @GetMapping("/mess-menu") public Iterable<MessMenu> messMenu() { return messMenu.findAll(); }
    @PostMapping("/mess-menu") public MessMenu saveMessMenu(@RequestBody MessMenu body) { return messMenu.save(body); }

    @GetMapping("/security-logs") public Iterable<SecurityLog> securityLogs() { return securityLogs.findAll(); }
    @PostMapping("/security-logs") public SecurityLog saveSecurityLog(@RequestBody SecurityLog body) { return securityLogs.save(body); }
}
