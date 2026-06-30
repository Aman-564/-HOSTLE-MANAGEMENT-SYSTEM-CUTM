package com.hostel.management.controller;

import com.hostel.management.entity.Payment;
import com.hostel.management.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments.stream()
                .map(this::toPaymentResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(payment -> ResponseEntity.ok(toPaymentResponse(payment)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Map<String, Object>>> getPaymentsByBooking(@PathVariable Long bookingId) {
        List<Payment> payments = paymentService.getPaymentsByBooking(bookingId);
        return ResponseEntity.ok(payments.stream()
                .map(this::toPaymentResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestHeader(value = "X-User-Role", required = false) String role,
                                           @RequestBody Payment payment) {
        if (!AdminAccess.isAdmin(role)) {
            return AdminAccess.forbidden();
        }
        try {
            Payment createdPayment = paymentService.createPayment(payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(toPaymentResponse(createdPayment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(@RequestHeader(value = "X-User-Role", required = false) String role,
                                           @PathVariable Long id,
                                           @RequestBody Payment payment) {
        if (!AdminAccess.isAdmin(role)) {
            return AdminAccess.forbidden();
        }
        try {
            Payment updatedPayment = paymentService.updatePayment(id, payment);
            return ResponseEntity.ok(toPaymentResponse(updatedPayment));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@RequestHeader(value = "X-User-Role", required = false) String role,
                                           @PathVariable Long id) {
        if (!AdminAccess.isAdmin(role)) {
            return AdminAccess.forbidden();
        }
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    private Map<String, Object> toPaymentResponse(Payment payment) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", payment.getId());
        response.put("amount", payment.getAmount());
        response.put("paymentDate", payment.getPaymentDate());
        response.put("paymentMethod", payment.getPaymentMethod());
        response.put("transactionId", payment.getTransactionId());
        response.put("status", payment.getStatus());
        response.put("remarks", payment.getRemarks());

        Map<String, Object> booking = new LinkedHashMap<>();
        booking.put("id", payment.getBooking().getId());
        booking.put("checkInDate", payment.getBooking().getCheckInDate());
        booking.put("checkOutDate", payment.getBooking().getCheckOutDate());
        booking.put("status", payment.getBooking().getStatus());
        booking.put("totalAmount", payment.getBooking().getTotalAmount());
        booking.put("paymentStatus", payment.getBooking().getPaymentStatus());

        Map<String, Object> student = new LinkedHashMap<>();
        student.put("id", payment.getBooking().getStudent().getId());
        student.put("name", payment.getBooking().getStudent().getName());
        student.put("email", payment.getBooking().getStudent().getEmail());
        booking.put("student", student);

        Map<String, Object> room = new LinkedHashMap<>();
        room.put("id", payment.getBooking().getRoom().getId());
        room.put("roomNumber", payment.getBooking().getRoom().getRoomNumber());
        room.put("roomType", payment.getBooking().getRoom().getRoomType());
        booking.put("room", room);

        response.put("booking", booking);
        return response;
    }
}
