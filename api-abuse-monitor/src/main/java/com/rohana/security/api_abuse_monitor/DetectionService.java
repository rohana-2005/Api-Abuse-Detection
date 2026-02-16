package com.rohana.security.api_abuse_monitor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DetectionService {

    @Autowired
    private RequestLogRepository repository;

    public List<String> detectHighTrafficIps() {

        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);

        List<Object[]> results =
                repository.findSuspiciousIps(oneMinuteAgo, 50);

        List<String> suspiciousIps = new ArrayList<>();

        for (Object[] row : results) {
            suspiciousIps.add((String) row[0]);
        }

        return suspiciousIps;
    }
}
