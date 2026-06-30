package com.hostel.management.repository;

import com.hostel.management.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    long countByStatus(String status);
}
