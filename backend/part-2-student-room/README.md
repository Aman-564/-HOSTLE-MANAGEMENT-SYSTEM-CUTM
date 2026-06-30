# Part 2: Students, Rooms, and Booking

Student owner: Backend Student 2

## Responsibility

Maintain hostel allocation workflows:
- Student CRUD and profile data
- Room records and room availability
- Booking and allocation rules
- Repositories and services for student, room, and booking data

## Work In These Files

- `../src/main/java/com/hostel/management/controller/StudentController.java`
- `../src/main/java/com/hostel/management/controller/RoomController.java`
- `../src/main/java/com/hostel/management/controller/BookingController.java`
- `../src/main/java/com/hostel/management/service/StudentService.java`
- `../src/main/java/com/hostel/management/service/RoomService.java`
- `../src/main/java/com/hostel/management/service/BookingService.java`
- `../src/main/java/com/hostel/management/entity/Student.java`
- `../src/main/java/com/hostel/management/entity/Room.java`
- `../src/main/java/com/hostel/management/entity/Booking.java`
- `../src/main/java/com/hostel/management/repository/StudentRepository.java`
- `../src/main/java/com/hostel/management/repository/RoomRepository.java`
- `../src/main/java/com/hostel/management/repository/BookingRepository.java`

## Checklist

- Keep entity fields aligned with the frontend data display.
- Validate room capacity and booking state changes carefully.
- Coordinate with Part 3 before changing payment or operations data.
- Test with `mvn test` from the `backend` folder.
