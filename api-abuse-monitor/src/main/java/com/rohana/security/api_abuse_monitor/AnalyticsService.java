package com.rohana.security.api_abuse_monitor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private RequestLogRepository requestLogRepository;

    @Autowired
    private IpRiskScoreRepository ipRiskScoreRepository;

    @Autowired
    private SuspiciousIpRepository suspiciousIpRepository;

    // STEP 1 — Total requests today
    public long getTodayRequestCount() {
        return requestLogRepository.countTodayRequests(
                LocalDate.now().atStartOfDay()
        );
    }

    // STEP 2 — Requests per minute (last hour) for traffic graph
    public List<Map<String, Object>> getTrafficLastHour() {
        List<Object[]> results = requestLogRepository.getRequestsPerMinute(
                LocalDateTime.now().minusHours(1)
        );

        List<Map<String, Object>> traffic = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> point = new HashMap<>();
            point.put("minute", row[0].toString());
            point.put("count", row[1]);
            traffic.add(point);
        }
        return traffic;
    }

    // STEP 3 — Top offending IPs
    public List<Map<String, Object>> getTopOffendingIps() {
        List<Object[]> results = requestLogRepository.getTopIps(
                LocalDateTime.now().minusHours(1)
        );

        List<Map<String, Object>> ips = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("ip", row[0]);
            entry.put("count", row[1]);
            ips.add(entry);
        }
        return ips;
    }

    // STEP 4 — Endpoint attack stats
    public List<Map<String, Object>> getEndpointStats() {
        List<Object[]> results = requestLogRepository.getEndpointStats(
                LocalDateTime.now().minusHours(1)
        );

        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("endpoint", row[0]);
            entry.put("count", row[1]);
            stats.add(entry);
        }
        return stats;
    }

    // STEP 5 — Failed login count (brute force)
    public long getFailedLoginCount() {
        return requestLogRepository.getFailedLogins(
                LocalDateTime.now().minusHours(1)
        );
    }

    // STEP 6 — Active threat count
    public long getActiveThreatCount() {
        return suspiciousIpRepository.count();
    }

    // STEP 6 — List of suspicious IPs
    public List<SuspiciousIp> getSuspiciousIps() {
        return suspiciousIpRepository.findAllByOrderByDetectedAtDesc();
    }

    // STEP 7 — Risk score table
    public List<IpRiskScore> getRiskScores() {
        return ipRiskScoreRepository.findAllByOrderByRiskScoreDesc();
    }

    // STEP 7 — Update risk score for an IP
    public void updateRiskScore(String ip, int score) {
        String level;
        if (score >= 80) level = "CRITICAL";
        else if (score >= 60) level = "HIGH";
        else if (score >= 40) level = "MEDIUM";
        else level = "LOW";

        Optional<IpRiskScore> existing = ipRiskScoreRepository.findByIp(ip);
        if (existing.isPresent()) {
            IpRiskScore record = existing.get();
            record.setRiskScore(score);
            record.setRiskLevel(level);
            record.setLastUpdated(LocalDateTime.now());
            ipRiskScoreRepository.save(record);
        } else {
            ipRiskScoreRepository.save(new IpRiskScore(ip, score, level));
        }
    }

    // Full dashboard summary
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRequestsToday", getTodayRequestCount());
        summary.put("trafficPerMinute", getTrafficLastHour());
        summary.put("topOffendingIps", getTopOffendingIps());
        summary.put("endpointStats", getEndpointStats());
        summary.put("failedLogins", getFailedLoginCount());
        summary.put("activeThreats", getActiveThreatCount());
        summary.put("suspiciousIps", getSuspiciousIps());
        summary.put("riskScores", getRiskScores());
        return summary;
    }
}
