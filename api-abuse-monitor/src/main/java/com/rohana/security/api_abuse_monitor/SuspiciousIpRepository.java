package com.rohana.security.api_abuse_monitor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuspiciousIpRepository extends JpaRepository<SuspiciousIp, Long> {

    List<SuspiciousIp> findAllByOrderByDetectedAtDesc();

    long count();
}
