# Part 1: Auth and Config

Student owner: Backend Student 1

## Responsibility

Maintain backend setup and access flow:
- Spring Boot application entry point
- CORS settings for frontend connection
- Seed/demo data
- Login/auth endpoints
- Admin access checks
- Database connection settings

## Work In These Files

- `../src/main/java/com/hostel/management/HostelManagementApplication.java`
- `../src/main/java/com/hostel/management/config/CorsConfig.java`
- `../src/main/java/com/hostel/management/config/DataSeeder.java`
- `../src/main/java/com/hostel/management/controller/AuthController.java`
- `../src/main/java/com/hostel/management/controller/AdminAccess.java`
- `../src/main/resources/application.properties`

## Checklist

- Do not change Java package names unless the whole team agrees.
- Keep frontend CORS origins in sync with the frontend port.
- Do not commit private database passwords.
- Test with `mvn test` from the `backend` folder.
