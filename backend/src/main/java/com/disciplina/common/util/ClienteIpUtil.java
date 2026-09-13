package com.disciplina.common.util;

import jakarta.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

public final class ClienteIpUtil {

    private static final Pattern IPV4_PATTERN = Pattern.compile(
            "^(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}$");
    private static final Pattern IPV6_PATTERN = Pattern.compile("^[0-9a-fA-F:]{2,39}$");

    private ClienteIpUtil() {
    }

    public static String obtenerIpCliente(HttpServletRequest request) {
        if (request == null) {
            return "127.0.0.1";
        }

        String remoteAddr = request.getRemoteAddr();
        if (remoteAddr == null || remoteAddr.isBlank()) {
            remoteAddr = "127.0.0.1";
        } else {
            remoteAddr = remoteAddr.trim();
        }

        // Only inspect X-Forwarded-For if the immediate peer (remoteAddr) is a local/proxy address
        if (esIpLocalOProxy(remoteAddr)) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isBlank()) {
                String candidateIp = xForwardedFor.split(",")[0].trim();
                if (esIpValida(candidateIp)) {
                    return candidateIp;
                }
            }
        }

        return esIpValida(remoteAddr) ? remoteAddr : "127.0.0.1";
    }

    private static boolean esIpLocalOProxy(String ip) {
        return "127.0.0.1".equals(ip)
                || "0:0:0:0:0:0:0:1".equals(ip)
                || "::1".equals(ip)
                || ip.startsWith("10.")
                || ip.startsWith("192.168.")
                || ip.startsWith("172.16.")
                || ip.startsWith("172.17.")
                || ip.startsWith("172.18.")
                || ip.startsWith("172.19.")
                || ip.startsWith("172.20.")
                || ip.startsWith("172.21.")
                || ip.startsWith("172.22.")
                || ip.startsWith("172.23.")
                || ip.startsWith("172.24.")
                || ip.startsWith("172.25.")
                || ip.startsWith("172.26.")
                || ip.startsWith("172.27.")
                || ip.startsWith("172.28.")
                || ip.startsWith("172.29.")
                || ip.startsWith("172.30.")
                || ip.startsWith("172.31.");
    }

    private static boolean esIpValida(String ip) {
        if (ip == null || ip.isBlank() || ip.length() > 45) {
            return false;
        }
        return IPV4_PATTERN.matcher(ip).matches() || IPV6_PATTERN.matcher(ip).matches();
    }
}
