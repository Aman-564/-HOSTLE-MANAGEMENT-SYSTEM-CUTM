# Backend Contribution Split

Keep the Spring Boot source folder (`src/main/java/com/hostel/management`) in its current location. Java package names and Maven expect this layout.

Use the three `part-*` folders as student ownership areas. Each folder contains the scope, real files to edit, and a checklist for that backend contributor.

## Student 4: Auth and Config

Folder: `part-1-auth-config`

Owns application startup, CORS, seed data, login/auth endpoints, admin access checks, and database configuration.

Main files:
- `src/main/java/com/hostel/management/HostelManagementApplication.java`
- `src/main/java/com/hostel/management/config/CorsConfig.java`
- `src/main/java/com/hostel/management/config/DataSeeder.java`
- `src/main/java/com/hostel/management/controller/AuthController.java`
- `src/main/java/com/hostel/management/controller/AdminAccess.java`
- `src/main/resources/application.properties`

## Student 5: Students, Rooms, and Booking

Folder: `part-2-student-room`

Owns student records, rooms, room allocation, and booking workflows.

Main files:
- `src/main/java/com/hostel/management/controller/StudentController.java`
- `src/main/java/com/hostel/management/controller/RoomController.java`
- `src/main/java/com/hostel/management/controller/BookingController.java`
- `src/main/java/com/hostel/management/service/StudentService.java`
- `src/main/java/com/hostel/management/service/RoomService.java`
- `src/main/java/com/hostel/management/service/BookingService.java`
- `src/main/java/com/hostel/management/entity/Student.java`
- `src/main/java/com/hostel/management/entity/Room.java`
- `src/main/java/com/hostel/management/entity/Booking.java`
- `src/main/java/com/hostel/management/repository/StudentRepository.java`
- `src/main/java/com/hostel/management/repository/RoomRepository.java`
- `src/main/java/com/hostel/management/repository/BookingRepository.java`

## Student 6: Operations and Finance

Folder: `part-3-operations-finance`

Owns payments, attendance, leave, complaints, notices, mess menu, visitors, security logs, and operations reports.

Main files:
- `src/main/java/com/hostel/management/controller/OperationsController.java`
- `src/main/java/com/hostel/management/controller/PaymentController.java`
- `src/main/java/com/hostel/management/service/PaymentService.java`
- `src/main/java/com/hostel/management/entity/Payment.java`
- `src/main/java/com/hostel/management/entity/Attendance.java`
- `src/main/java/com/hostel/management/entity/Complaint.java`
- `src/main/java/com/hostel/management/entity/LeaveRequest.java`
- `src/main/java/com/hostel/management/entity/MessMenu.java`
- `src/main/java/com/hostel/management/entity/Notice.java`
- `src/main/java/com/hostel/management/entity/SecurityLog.java`
- `src/main/java/com/hostel/management/entity/Visitor.java`
- `src/main/java/com/hostel/management/repository/PaymentRepository.java`
- `src/main/java/com/hostel/management/repository/AttendanceRepository.java`
- `src/main/java/com/hostel/management/repository/ComplaintRepository.java`
- `src/main/java/com/hostel/management/repository/LeaveRequestRepository.java`
- `src/main/java/com/hostel/management/repository/MessMenuRepository.java`
- `src/main/java/com/hostel/management/repository/NoticeRepository.java`
- `src/main/java/com/hostel/management/repository/SecurityLogRepository.java`
- `src/main/java/com/hostel/management/repository/VisitorRepository.java`

## Team Rule

Before final submission, run this from the `backend` folder:

```powershell
mvn test
```
