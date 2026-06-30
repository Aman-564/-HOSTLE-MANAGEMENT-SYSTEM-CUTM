# Part 3: Operations and Finance

Student owner: Backend Student 3

## Responsibility

Maintain daily hostel operations and payment workflows:
- Payments and fee records
- Attendance
- Leave requests
- Complaints
- Notices
- Mess menu
- Visitors and security logs
- Operations dashboard endpoints

## Work In These Files

- `../src/main/java/com/hostel/management/controller/OperationsController.java`
- `../src/main/java/com/hostel/management/controller/PaymentController.java`
- `../src/main/java/com/hostel/management/service/PaymentService.java`
- `../src/main/java/com/hostel/management/entity/Payment.java`
- `../src/main/java/com/hostel/management/entity/Attendance.java`
- `../src/main/java/com/hostel/management/entity/Complaint.java`
- `../src/main/java/com/hostel/management/entity/LeaveRequest.java`
- `../src/main/java/com/hostel/management/entity/MessMenu.java`
- `../src/main/java/com/hostel/management/entity/Notice.java`
- `../src/main/java/com/hostel/management/entity/SecurityLog.java`
- `../src/main/java/com/hostel/management/entity/Visitor.java`
- `../src/main/java/com/hostel/management/repository/PaymentRepository.java`
- `../src/main/java/com/hostel/management/repository/AttendanceRepository.java`
- `../src/main/java/com/hostel/management/repository/ComplaintRepository.java`
- `../src/main/java/com/hostel/management/repository/LeaveRequestRepository.java`
- `../src/main/java/com/hostel/management/repository/MessMenuRepository.java`
- `../src/main/java/com/hostel/management/repository/NoticeRepository.java`
- `../src/main/java/com/hostel/management/repository/SecurityLogRepository.java`
- `../src/main/java/com/hostel/management/repository/VisitorRepository.java`

## Checklist

- Keep payment and operations endpoints stable for the frontend.
- Check that dashboard summaries still match the database fields.
- Coordinate with Part 2 when payments depend on bookings or room allocation.
- Test with `mvn test` from the `backend` folder.
