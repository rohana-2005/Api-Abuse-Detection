package com.rohana.security.api_abuse_monitor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IpRiskScoreRepository extends JpaRepository<IpRiskScore, Long> {

    Optional<IpRiskScore> findByIp(String ip);

    List<IpRiskScore> findAllByOrderByRiskScoreDesc();
}
