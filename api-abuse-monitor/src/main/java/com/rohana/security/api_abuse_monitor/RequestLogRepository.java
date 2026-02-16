package com.rohana.security.api_abuse_monitor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {

    // STEP 1 — Suspicious IPs (>threshold in time window)
    @Query("""
        SELECT r.ipAddress, COUNT(r)
        FROM RequestLog r
        WHERE r.timestamp >= :startTime
        GROUP BY r.ipAddress
        HAVING COUNT(r) > :threshold
    """)
    List<Object[]> findSuspiciousIps(
            @Param("startTime") LocalDateTime startTime,
            @Param("threshold") long threshold
    );

    // STEP 1 — Total requests today
    @Query("""
        SELECT COUNT(r)
        FROM RequestLog r
        WHERE r.timestamp >= :startOfDay
    """)
    long countTodayRequests(@Param("startOfDay") LocalDateTime startOfDay);

    // STEP 2 — Requests per minute (traffic graph)
    @Query(value = """
        SELECT DATE_TRUNC('minute', r.timestamp) AS minute, COUNT(r.id)
        FROM request_logs r
        WHERE r.timestamp >= :startTime
        GROUP BY DATE_TRUNC('minute', r.timestamp)
        ORDER BY DATE_TRUNC('minute', r.timestamp)
    """, nativeQuery = true)
    List<Object[]> getRequestsPerMinute(
            @Param("startTime") LocalDateTime startTime
    );

    // STEP 3 — Top offending IPs
    @Query("""
        SELECT r.ipAddress, COUNT(r)
        FROM RequestLog r
        WHERE r.timestamp >= :startTime
        GROUP BY r.ipAddress
        ORDER BY COUNT(r) DESC
    """)
    List<Object[]> getTopIps(
            @Param("startTime") LocalDateTime startTime
    );

    // STEP 4 — Endpoint attack stats
    @Query("""
        SELECT r.endpoint, COUNT(r)
        FROM RequestLog r
        WHERE r.timestamp >= :startTime
        GROUP BY r.endpoint
        ORDER BY COUNT(r) DESC
    """)
    List<Object[]> getEndpointStats(
            @Param("startTime") LocalDateTime startTime
    );

    // STEP 5 — Failed login count (brute force detection)
    @Query("""
        SELECT COUNT(r)
        FROM RequestLog r
        WHERE r.endpoint = '/api/login'
        AND r.statusCode = 401
        AND r.timestamp >= :startTime
    """)
    long getFailedLogins(
            @Param("startTime") LocalDateTime startTime
    );
}
