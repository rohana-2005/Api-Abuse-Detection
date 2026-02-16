package com.rohana.security.api_abuse_monitor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suspicious_ips")
public class SuspiciousIp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ipAddress;

    private String reason; // HIGH_TRAFFIC, BRUTE_FORCE, ENDPOINT_SCANNING

    private long requestCount;

    private LocalDateTime detectedAt;

    public SuspiciousIp() {}

    public SuspiciousIp(String ipAddress, String reason, long requestCount) {
        this.ipAddress = ipAddress;
        this.reason = reason;
        this.requestCount = requestCount;
        this.detectedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public long getRequestCount() { return requestCount; }
    public void setRequestCount(long requestCount) { this.requestCount = requestCount; }

    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }
}
