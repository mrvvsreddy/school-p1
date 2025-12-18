"""
Security utilities module
Provides rate limiting, security headers, and other security middleware
"""

import time
import logging
from collections import defaultdict
from typing import Callable, Optional
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


# ============= RATE LIMITER =============

class RateLimiter:
    """
    Simple in-memory rate limiter
    For production, consider using Redis-based rate limiting
    """
    
    def __init__(self):
        # Store: {key: [(timestamp, count), ...]}
        self.requests = defaultdict(list)
        self.blocked_ips = {}  # {ip: unblock_time}
    
    def _cleanup_old_requests(self, key: str, window_seconds: int):
        """Remove requests older than the time window"""
        cutoff = time.time() - window_seconds
        self.requests[key] = [
            (ts, count) for ts, count in self.requests[key] 
            if ts > cutoff
        ]
    
    def is_blocked(self, ip: str) -> bool:
        """Check if IP is temporarily blocked"""
        if ip in self.blocked_ips:
            if time.time() < self.blocked_ips[ip]:
                return True
            else:
                del self.blocked_ips[ip]
        return False
    
    def block_ip(self, ip: str, duration_seconds: int = 300):
        """Block an IP for a duration (default 5 minutes)"""
        self.blocked_ips[ip] = time.time() + duration_seconds
        logger.warning(f"IP {ip} blocked for {duration_seconds} seconds")
    
    def check_rate_limit(
        self, 
        key: str, 
        max_requests: int, 
        window_seconds: int
    ) -> tuple[bool, int]:
        """
        Check if request should be rate limited
        
        Returns:
            (is_allowed, remaining_requests)
        """
        self._cleanup_old_requests(key, window_seconds)
        
        total_requests = sum(count for _, count in self.requests[key])
        
        if total_requests >= max_requests:
            return False, 0
        
        # Record this request
        self.requests[key].append((time.time(), 1))
        
        return True, max_requests - total_requests - 1
    
    def record_failed_login(self, ip: str) -> int:
        """
        Record a failed login attempt
        Returns the number of failed attempts
        """
        key = f"failed_login:{ip}"
        self._cleanup_old_requests(key, 900)  # 15 minute window
        self.requests[key].append((time.time(), 1))
        return sum(count for _, count in self.requests[key])


# Global rate limiter instance
rate_limiter = RateLimiter()


# Rate limit configurations
RATE_LIMITS = {
    "login": {"max_requests": 5, "window_seconds": 60},       # 5 per minute
    "api_general": {"max_requests": 100, "window_seconds": 60},  # 100 per minute
    "public_form": {"max_requests": 10, "window_seconds": 60},   # 10 per minute
}

# Account lockout configuration
MAX_FAILED_LOGINS = 5
LOCKOUT_DURATION = 300  # 5 minutes


def get_client_ip(request: Request) -> str:
    """Get the real client IP, considering proxies"""
    # Check for forwarded header (behind proxy/load balancer)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    if request.client:
        return request.client.host
    
    return "unknown"


def check_rate_limit(request: Request, limit_type: str = "api_general") -> None:
    """
    Check rate limit and raise HTTPException if exceeded
    
    Usage in routes:
        @router.post("/login")
        async def login(request: Request):
            check_rate_limit(request, "login")
            ...
    """
    ip = get_client_ip(request)
    
    # Check if IP is blocked
    if rate_limiter.is_blocked(ip):
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": "300"}
        )
    
    config = RATE_LIMITS.get(limit_type, RATE_LIMITS["api_general"])
    
    allowed, remaining = rate_limiter.check_rate_limit(
        f"{limit_type}:{ip}",
        config["max_requests"],
        config["window_seconds"]
    )
    
    if not allowed:
        logger.warning(f"Rate limit exceeded for {ip} on {limit_type}")
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Please wait before making more requests.",
            headers={"Retry-After": str(config["window_seconds"])}
        )


def record_failed_login(request: Request) -> bool:
    """
    Record failed login attempt and check for lockout
    
    Returns:
        True if account should be locked out
    """
    ip = get_client_ip(request)
    failed_count = rate_limiter.record_failed_login(ip)
    
    if failed_count >= MAX_FAILED_LOGINS:
        rate_limiter.block_ip(ip, LOCKOUT_DURATION)
        logger.warning(f"Account lockout triggered for IP {ip} after {failed_count} failed attempts")
        return True
    
    return False


def clear_failed_logins(request: Request) -> None:
    """Clear failed login attempts after successful login"""
    ip = get_client_ip(request)
    key = f"failed_login:{ip}"
    if key in rate_limiter.requests:
        del rate_limiter.requests[key]


# ============= SECURITY HEADERS MIDDLEWARE =============

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds security headers to all responses
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        
        # Enable XSS filter
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Referrer policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Content Security Policy (adjust as needed for your frontend)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https:;"
        )
        
        # Permissions policy
        response.headers["Permissions-Policy"] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=()"
        )
        
        return response
