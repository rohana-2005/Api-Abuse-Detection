package com.rohana.security.api_abuse_monitor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    @Autowired
    private DetectionService detectionService;

    @GetMapping("/suspicious")
    public List<String> getSuspiciousIps() {
        return detectionService.detectHighTrafficIps();
    }
}
