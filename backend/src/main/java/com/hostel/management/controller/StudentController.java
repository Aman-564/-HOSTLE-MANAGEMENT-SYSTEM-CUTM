package com.hostel.management.controller;

import com.hostel.management.entity.Student;
import com.hostel.management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestHeader(value = "X-User-Role", required = false) String role,
                                           @RequestBody Student student) {
        if (!AdminAccess.isAdmin(role)) {
            return AdminAccess.forbidden();
        }
        try {
            Student createdStudent = studentService.createStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@RequestHeader(value = "X-User-Role", required = false) String role,
                                           @PathVariable Long id,
                                           @RequestBody Student student) {
        if (!AdminAccess.isAdmin(role)) {
            return AdminAccess.forbidden();
        }
        try {
            Student updatedStudent = studentService.updateStudent(id, student);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@RequestHeader(value = "X-User-Role", required = false) String role,
                                           @PathVariable Long id) {
        if (!AdminAccess.isAdmin(role)) {
            return AdminAccess.forbidden();
        }
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
