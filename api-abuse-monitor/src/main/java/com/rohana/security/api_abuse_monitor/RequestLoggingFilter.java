package com.rohana.security.api_abuse_monitor;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Autowired
    private RequestLogRepository requestLogRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        long startTime = System.currentTimeMillis();

        filterChain.doFilter(request, response);

        long duration = System.currentTimeMillis() - startTime;

        String ip = request.getRemoteAddr();
        String endpoint = request.getRequestURI();
        String method = request.getMethod();
        int status = response.getStatus();

        // Save to RDS
        RequestLog log = new RequestLog(ip, endpoint, method, status, duration);
        requestLogRepository.save(log);

        System.out.println("IP: " + ip +
                " | Endpoint: " + endpoint +
                " | Method: " + method +
                " | Status: " + status +
                " | Time: " + duration + "ms");
    }
}
