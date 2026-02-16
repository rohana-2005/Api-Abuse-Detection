package com.rohana.security.api_abuse_monitor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AnalyticsService analyticsService;

    // GET /api/dashboard/summary — All data in one call
    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {
        return analyticsService.getDashboardSummary();
    }

    // GET /api/dashboard/total-requests — Total requests today
    @GetMapping("/total-requests")
    public Map<String, Object> getTotalRequests() {
        return Map.of("totalRequestsToday", analyticsService.getTodayRequestCount());
    }

    // GET /api/dashboard/traffic — Requests per minute (last hour)
    @GetMapping("/traffic")
    public List<Map<String, Object>> getTraffic() {
        return analyticsService.getTrafficLastHour();
    }

    // GET /api/dashboard/top-ips — Top offending IPs
    @GetMapping("/top-ips")
    public List<Map<String, Object>> getTopIps() {
        return analyticsService.getTopOffendingIps();
    }

    // GET /api/dashboard/endpoint-stats — Endpoint attack stats
    @GetMapping("/endpoint-stats")
    public List<Map<String, Object>> getEndpointStats() {
        return analyticsService.getEndpointStats();
    }

    // GET /api/dashboard/failed-logins — Failed login count
    @GetMapping("/failed-logins")
    public Map<String, Object> getFailedLogins() {
        return Map.of("failedLogins", analyticsService.getFailedLoginCount());
    }

    // GET /api/dashboard/threats — Active threats
    @GetMapping("/threats")
    public Map<String, Object> getThreats() {
        return Map.of(
                "activeThreatCount", analyticsService.getActiveThreatCount(),
                "suspiciousIps", analyticsService.getSuspiciousIps()
        );
    }

    // GET /api/dashboard/risk-scores — IP risk scores
    @GetMapping("/risk-scores")
    public List<IpRiskScore> getRiskScores() {
        return analyticsService.getRiskScores();
    }
}
