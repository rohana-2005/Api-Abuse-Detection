package com.rohana.security.api_abuse_monitor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DummyController {

    @Autowired
    private RequestLogRepository requestLogRepository;

    @GetMapping("/products")
    public String getProducts() {
        return "Product list";
    }

    @PostMapping("/login")
    public String login() {
        return "Login attempt";
    }

    @GetMapping("/profile")
    public String profile() {
        return "User profile";
    }

    @GetMapping("/search")
    public String search() {
        return "Search result";
    }

    @GetMapping("/logs")
    public List<RequestLog> getLogs() {
        return requestLogRepository.findAll();
    }
}
