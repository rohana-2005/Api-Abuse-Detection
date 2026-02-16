package com.rohana.security.api_abuse_monitor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ip_risk_score")
public class IpRiskScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String ip;

    private int riskScore;

    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL

    private LocalDateTime lastUpdated;

    public IpRiskScore() {}

    public IpRiskScore(String ip, int riskScore, String riskLevel) {
        this.ip = ip;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
