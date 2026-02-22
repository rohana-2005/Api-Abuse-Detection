"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface TrafficPoint {
  minute: string;
  count: number;
}

interface IpEntry {
  ip: string;
  count: number;
}

interface EndpointEntry {
  endpoint: string;
  count: number;
}

interface RiskEntry {
  ip: string;
  riskScore: number;
  riskLevel: string;
}

interface SuspiciousEntry {
  ipAddress: string;
  reason: string;
  requestCount: number;
  detectedAt: string;
}

interface DashboardData {
  totalRequestsToday: number;
  activeThreats: number;
  failedLogins: number;
  trafficPerMinute: TrafficPoint[];
  topOffendingIps: IpEntry[];
  endpointStats: EndpointEntry[];
  riskScores: RiskEntry[];
  suspiciousIps: SuspiciousEntry[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch("http://13.126.233.32/api/dashboard/summary")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: 18,
          color: "#5a6a7a",
          background: "#e8ecf1",
        }}
      >
        Loading Dashboard...
      </div>
    );

  if (!data)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: 18,
          color: "#d32f2f",
          background: "#e8ecf1",
        }}
      >
        Failed to load data. Is the backend running?
      </div>
    );

  const currentTraffic =
    data.trafficPerMinute.length > 0
      ? data.trafficPerMinute[data.trafficPerMinute.length - 1].count
      : 0;

  const peakTraffic = Math.max(
    ...data.trafficPerMinute.map((t) => t.count),
    0
  );

  const normalTraffic =
    data.trafficPerMinute.length > 0
      ? Math.round(
          data.trafficPerMinute.reduce((a, b) => a + b.count, 0) /
            data.trafficPerMinute.length
        )
      : 0;

  const blockedCount = data.suspiciousIps?.length || 0;

  const formatTime = (value: any): string => {
    if (!value) return "";
    try {
      const d = new Date(String(value));
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return String(value);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "CRITICAL":
        return "#d32f2f";
      case "HIGH":
        return "#d32f2f";
      case "MEDIUM":
        return "#ff9800";
      case "LOW":
        return "#4caf50";
      default:
        return "#90a4ae";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level?.toUpperCase()) {
      case "CRITICAL":
        return "#ffebee";
      case "HIGH":
        return "#ffebee";
      case "MEDIUM":
        return "#fff3e0";
      case "LOW":
        return "#e8f5e9";
      default:
        return "#eceff1";
    }
  };

  const getAlertIcon = (reason: string) => {
    switch (reason) {
      case "BRUTE_FORCE":
        return "🔐";
      case "HIGH_TRAFFIC":
        return "⚡";
      case "ENDPOINT_SCANNING":
        return "🔍";
      default:
        return "⚠️";
    }
  };

  const getAlertLabel = (reason: string) => {
    switch (reason) {
      case "BRUTE_FORCE":
        return "Brute Force Attempt";
      case "HIGH_TRAFFIC":
        return "DDoS Spike";
      case "ENDPOINT_SCANNING":
        return "API Scraping Detected";
      default:
        return "Suspicious Activity";
    }
  };

  const endpointColors = ["#1e3a5f", "#2e7d32", "#e65100"];

  return (
    <div
      style={{
        background: "#e8ecf1",
        minHeight: "100vh",
        padding: "24px 30px",
      }}
    >
      {/* Header */}
      <h1
        style={{
          textAlign: "center",
          fontSize: 26,
          fontWeight: 700,
          color: "#1a2332",
          marginBottom: 24,
          letterSpacing: 0.5,
        }}
      >
        API Abuse Monitoring Dashboard
      </h1>

      {/* ─── TOP STAT CARDS ─── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <StatCard
          icon="📊"
          iconBg="#e3f2fd"
          label="Total Requests"
          value={data.totalRequestsToday.toLocaleString()}
          sub="Today"
          color="#1565c0"
        />
        <StatCard
          icon="🚨"
          iconBg="#ffebee"
          label="Active Threats"
          value={String(data.activeThreats)}
          sub="Critical Alerts"
          color="#d32f2f"
        />
        <StatCard
          icon="🛡️"
          iconBg="#e8f5e9"
          label="Blocked IPs"
          value={String(blockedCount)}
          sub="IPs Blocked"
          color="#2e7d32"
        />
        <StatCard
          icon="📈"
          iconBg="#fce4ec"
          label="Current Traffic"
          value={currentTraffic.toLocaleString()}
          sub="req/min"
          color="#c62828"
        />
      </div>

      {/* ─── MIDDLE ROW: Traffic + Top IPs ─── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {/* Traffic Overview */}
        <div style={{ ...card, flex: 2 }}>
          <h3 style={sectionTitle}>Traffic Overview</h3>
          <div style={{ fontSize: 12, color: "#78909c", marginBottom: 4 }}>
            Requests per Minute
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.trafficPerMinute}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1976d2" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="spikeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef5350" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef5350" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="minute"
                tickFormatter={formatTime}
                tick={{ fontSize: 11, fill: "#90a4ae" }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#90a4ae" }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <Tooltip
                labelFormatter={formatTime}
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#1976d2"
                strokeWidth={2.5}
                fill="url(#trafficGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              gap: 30,
              marginTop: 8,
              fontSize: 13,
              color: "#607d8b",
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#1976d2",
                  marginRight: 6,
                }}
              />
              Normal Traffic: {normalTraffic} req/min
            </span>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ef5350",
                  marginRight: 6,
                }}
              />
              Attack Spike: {peakTraffic.toLocaleString()} req/min
            </span>
          </div>
        </div>

        {/* Right column: Top IPs + Geo */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Top Offending IPs */}
          <div style={card}>
            <h3 style={sectionTitle}>Top Offending IPs</h3>
            {data.topOffendingIps.length === 0 ? (
              <div style={{ color: "#b0bec5", fontSize: 13, padding: "12px 0" }}>
                No data yet
              </div>
            ) : (
              data.topOffendingIps.slice(0, 5).map((ip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      i < Math.min(data.topOffendingIps.length, 5) - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background:
                          i === 0
                            ? "#d32f2f"
                            : i === 1
                            ? "#1976d2"
                            : i === 2
                            ? "#ff9800"
                            : "#90a4ae",
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{ip.ip}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#607d8b" }}>
                      {ip.count.toLocaleString()} req
                    </span>
                    <span style={{ color: "#bdbdbd", fontSize: 16 }}>›</span>
                  </div>
                </div>
              ))
            )}
            {data.suspiciousIps?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 0 0",
                  borderTop: "1px solid #f0f0f0",
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#d32f2f",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#d32f2f", fontSize: 13, fontWeight: 600 }}>
                  Blocked: {data.suspiciousIps[0]?.ipAddress}
                </span>
              </div>
            )}
          </div>

          {/* Geo Activity */}
          <div style={card}>
            <h3 style={sectionTitle}>Geo Activity</h3>
            <div
              style={{
                background: "#f0f4f8",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
                position: "relative",
                minHeight: 100,
              }}
            >
              <div style={{ fontSize: 40, opacity: 0.7 }}>🌍</div>
              <div
                style={{
                  fontSize: 12,
                  color: "#78909c",
                  marginTop: 6,
                }}
              >
                {data.topOffendingIps.length} active source
                {data.topOffendingIps.length !== 1 ? "s" : ""} detected
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  justifyContent: "center",
                  marginTop: 10,
                  fontSize: 11,
                }}
              >
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#d32f2f",
                      marginRight: 4,
                    }}
                  />
                  High
                </span>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ff9800",
                      marginRight: 4,
                    }}
                  />
                  Medium
                </span>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#4caf50",
                      marginRight: 4,
                    }}
                  />
                  Low
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM MIDDLE: Endpoint Attacks + Risk Scores ─── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {/* Endpoint Attacks */}
        <div style={{ ...card, flex: 1 }}>
          <h3 style={sectionTitle}>Endpoint Attacks</h3>
          {data.endpointStats.length === 0 ? (
            <div style={{ color: "#b0bec5", fontSize: 13, padding: "12px 0" }}>
              No data yet
            </div>
          ) : (
            data.endpointStats.slice(0, 5).map((ep, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    width: 16,
                    textAlign: "center",
                  }}
                >
                  {ep.endpoint.includes("login")
                    ? "🔐"
                    : ep.endpoint.includes("search")
                    ? "🔍"
                    : "📡"}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#37474f",
                    minWidth: 90,
                  }}
                >
                  {ep.endpoint}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 22,
                    background: "#eceff1",
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(
                        (ep.count /
                          Math.max(
                            ...data.endpointStats.map((e) => e.count)
                          )) *
                          100,
                        100
                      )}%`,
                      background:
                        endpointColors[i % endpointColors.length],
                      borderRadius: 4,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: "#607d8b", minWidth: 80 }}>
                  {ep.count.toLocaleString()}{" "}
                  {ep.endpoint.includes("login") ? "Failed Logins" : "req/min"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Risk Scores */}
        <div style={{ ...card, flex: 1 }}>
          <h3 style={sectionTitle}>Risk Scores</h3>
          {data.riskScores.length === 0 ? (
            <div style={{ color: "#b0bec5", fontSize: 13, padding: "12px 0" }}>
              No risk scores yet
            </div>
          ) : (
            data.riskScores.slice(0, 5).map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom:
                    i < Math.min(data.riskScores.length, 5) - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: getRiskColor(r.riskLevel),
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{r.ip}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: getRiskColor(r.riskLevel),
                      background: getRiskBg(r.riskLevel),
                      padding: "3px 10px",
                      borderRadius: 12,
                    }}
                  >
                    {r.riskLevel} Risk
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: getRiskColor(r.riskLevel),
                      minWidth: 36,
                      textAlign: "right",
                    }}
                  >
                    {r.riskScore}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── BOTTOM ROW: Recent Alerts + Blocked IPs ─── */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* Recent Alerts */}
        <div style={{ ...card, flex: 2 }}>
          <h3 style={sectionTitle}>Recent Alerts</h3>
          {(!data.suspiciousIps || data.suspiciousIps.length === 0) ? (
            <div style={{ color: "#b0bec5", fontSize: 13, padding: "12px 0" }}>
              No alerts
            </div>
          ) : (
            data.suspiciousIps.slice(0, 5).map((alert, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom:
                    i < Math.min(data.suspiciousIps.length, 5) - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#ffebee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    {getAlertIcon(alert.reason)}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#d32f2f" }}>
                      {getAlertLabel(alert.reason)}
                    </div>
                    <div style={{ fontSize: 12, color: "#90a4ae" }}>
                      {alert.ipAddress} · {alert.requestCount} requests
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ef5350",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#ef5350", fontWeight: 500 }}>
                    {formatAlertTime(alert.detectedAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Blocked IPs */}
        <div style={{ ...card, flex: 1 }}>
          <h3 style={sectionTitle}>Blocked IPs</h3>
          {(!data.suspiciousIps || data.suspiciousIps.length === 0) ? (
            <div style={{ color: "#b0bec5", fontSize: 13, padding: "12px 0" }}>
              No blocked IPs
            </div>
          ) : (
            data.suspiciousIps.slice(0, 5).map((ip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom:
                    i < Math.min(data.suspiciousIps.length, 5) - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#ffebee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    🚫
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {ip.ipAddress}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#78909c",
                    fontStyle: "italic",
                  }}
                >
                  Auto Blocked
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card Component ─── */
function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        borderRadius: 12,
        padding: "20px 18px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#90a4ae", fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: "#b0bec5" }}>{sub}</div>
      </div>
    </div>
  );
}

/* ─── Shared Styles ─── */
const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: "18px 20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#1a2332",
  marginBottom: 12,
  marginTop: 0,
};

function formatAlertTime(dt: string) {
  try {
    const d = new Date(dt);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString();
  } catch {
    return dt;
  }
}
