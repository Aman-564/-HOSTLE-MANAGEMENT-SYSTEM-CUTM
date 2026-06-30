package com.hostel.management.repository;

import com.hostel.management.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    long countByStatus(String status);
}
