package com.hostel.management.config;

import com.hostel.management.entity.*;
import com.hostel.management.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedDemoData(
            @Value("${app.seed-demo-data:true}") boolean enabled,
            StudentRepository students,
            RoomRepository rooms,
            ComplaintRepository complaints,
            NoticeRepository notices,
            LeaveRequestRepository leaves,
            VisitorRepository visitors,
            AttendanceRepository attendance,
            MessMenuRepository messMenu,
            SecurityLogRepository securityLogs) {
        return args -> {
            if (!enabled || students.count() > 0) {
                return;
            }

            Student student = new Student("Aisha Rao", "student@hostelos.test", "+919999999999",
                    "B Block, Campus Road", "National Institute", "Ravi Rao", "+918888888888", "ACTIVE");
            students.save(student);

            rooms.save(new Room("A-101", "SINGLE", 1, 0, 22000.0, "1", "AC, WiFi, Attached Bath", "AVAILABLE"));
            rooms.save(new Room("A-204", "DOUBLE", 2, 1, 14500.0, "2", "Non-AC, WiFi, Balcony", "AVAILABLE"));
            rooms.save(new Room("B-312", "TRIPLE", 3, 2, 12500.0, "3", "AC, Near Mess, Lift", "AVAILABLE"));

            Complaint complaint = new Complaint();
            complaint.setStudentName("Aisha Rao");
            complaint.setTitle("Wi-Fi weak near B Block study lounge");
            complaint.setDescription("Signal drops during evening study hours.");
            complaint.setCategory("MAINTENANCE");
            complaint.setPriority("HIGH");
            complaint.setStatus("OPEN");
            complaint.setAssignedTo("Mr. Kapoor");
            complaints.save(complaint);

            Notice notice = new Notice();
            notice.setTitle("Fee window closes soon");
            notice.setBody("Semester hostel fee window closes on 28 June.");
            notice.setAudience("ALL");
            notice.setPriority("IMPORTANT");
            notices.save(notice);

            LeaveRequest leave = new LeaveRequest();
            leave.setStudentName("Aisha Rao");
            leave.setFromDate(LocalDate.now().plusDays(3));
            leave.setToDate(LocalDate.now().plusDays(5));
            leave.setReason("Family function");
            leaves.save(leave);

            Visitor visitor = new Visitor();
            visitor.setStudentName("Aisha Rao");
            visitor.setVisitorName("Ravi Rao");
            visitor.setPhone("+918888888888");
            visitor.setRelation("Father");
            visitor.setPurpose("Weekend visit");
            visitor.setCheckIn(LocalDateTime.now().plusDays(1));
            visitors.save(visitor);

            Attendance record = new Attendance();
            record.setStudentName("Aisha Rao");
            record.setStatus("PRESENT");
            record.setMethod("QR");
            attendance.save(record);

            MessMenu menu = new MessMenu();
            menu.setDayName("Monday");
            menu.setBreakfast("Idli, sambar, fruit");
            menu.setLunch("Rice, dal, paneer, salad");
            menu.setSnacks("Tea, poha");
            menu.setDinner("Roti, mixed veg, curd");
            menu.setCalories(2200);
            messMenu.save(menu);

            SecurityLog log = new SecurityLog();
            log.setLogType("ENTRY");
            log.setStudentName("Aisha Rao");
            log.setMessage("QR entry recorded at main gate");
            log.setSeverity("LOW");
            securityLogs.save(log);
        };
    }
}
