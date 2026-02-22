package com.rohana.security.api_abuse_monitor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "API Abuse Monitor is Running 🚀";
    }
}