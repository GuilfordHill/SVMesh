# SVMesh Production Deployment Checklist

## Pre-Deployment Security Review

### Environment Configuration
- [ ] Copy `.env.example` to `.env` and configure all values
- [ ] Set `ALLOWED_HOSTS` to your actual domain(s)
- [ ] Set `ALLOWED_ORIGINS` for CORS to your actual domain(s)
- [ ] Verify `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Generate strong random secrets for any authentication keys
- [ ] Review and set appropriate `RATE_LIMIT_REQUESTS_PER_MINUTE`

### Traefik Integration
- [ ] Verify Traefik proxy is configured to forward to this nginx instance
- [ ] Ensure nginx port (default 8081) is accessible from Traefik server
- [ ] Configure firewall to allow traffic from Traefik server IP only
- [ ] Test SSL configuration on Traefik with https://www.ssllabs.com/ssltest/
- [ ] Verify HSTS headers are properly configured (from Traefik)
- [ ] Ensure HTTP to HTTPS redirect is working (handled by Traefik)
- [ ] Test X-Forwarded-* headers are properly passed from Traefik to nginx

### Docker & Container Security
- [ ] Build production Docker image: `docker build -t svmesh-site:latest .`
- [ ] Verify container runs as non-root user: `docker exec svmesh-app id`
- [ ] Check for security vulnerabilities: `docker scan svmesh-site:latest`
- [ ] Ensure read-only filesystem where possible
- [ ] Verify security options in docker-compose.prod.yml are active
- [ ] Test health check endpoint: `curl http://localhost:8080/health`

### Application Security
- [ ] Remove or disable Swagger UI in production (already configured)
- [ ] Verify CORS policy only allows your domains
- [ ] Test rate limiting is active
- [ ] Verify security headers are present (use securityheaders.com)
- [ ] Ensure error messages don't leak sensitive information
- [ ] Validate file path inputs are properly sanitized
- [ ] Check that logging doesn't log sensitive data

### Network Security
- [ ] Configure firewall to only allow ports 80, 443, and SSH
- [ ] Disable SSH password authentication (use keys only)
- [ ] Set up fail2ban or similar brute-force protection
- [ ] Restrict SSH to specific IP addresses if possible
- [ ] Ensure internal Docker network is isolated
- [ ] Configure nginx/reverse proxy rate limiting

### Infrastructure
- [ ] Set up automated backups for content files
- [ ] Configure log rotation
- [ ] Set up monitoring and alerting
- [ ] Configure automated security updates
- [ ] Document disaster recovery procedures
- [ ] Set up health check monitoring (uptime monitoring service)

### Code Security
- [ ] Run dependency audit: `npm audit` in svmesh.client/
- [ ] Check for outdated packages: `npm outdated`
- [ ] Review all dependencies for security advisories
- [ ] Scan .NET packages: `dotnet list package --vulnerable`
- [ ] Remove any unused dependencies

### Access Control
- [ ] Change default passwords for any services
- [ ] Set up SSH key-based authentication
- [ ] Limit sudo access to necessary users only
- [ ] Set up audit logging for privileged operations
- [ ] Document who has access to production systems

### Content Security
- [ ] Validate all markdown content is sanitized (rehype-sanitize is configured)
- [ ] Review Content-Security-Policy headers
- [ ] Ensure user-uploaded content (if any) is validated
- [ ] Set appropriate file size limits
- [ ] Restrict file types that can be served

### Monitoring & Logging
- [ ] Configure centralized logging (optional: ELK stack, Loki, etc.)
- [ ] Set up error alerting
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Monitor disk space usage
- [ ] Set up SSL certificate expiration alerts

## Deployment Steps

### 1. Initial Setup
```bash
# Clone repository to production server
git clone <repository-url> /opt/svmesh
cd /opt/svmesh

# Copy and configure environment variables
cp .env.example .env
nano .env  # Edit with your production values

# Create content directories
mkdir -p /opt/svmesh/pages
mkdir -p /opt/svmesh/updates
```

### 2. Build Application
```bash
# Build the Docker image
docker build -t svmesh-site:latest .

# Verify the build
docker images | grep svmesh
```

### 3. Deploy with Docker Compose
```bash
# Start the application
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Verify containers are running
docker-compose -f docker-compose.prod.yml ps
```

### 4. Verify Deployment
```bash
# Test health endpoint
curl http://localhost:8080/health

# Test nginx is serving requests
curl http://localhost

# Check security headers
curl -I https://yourdomain.com
```

### 5. Post-Deployment
- [ ] Test all application functionality
- [ ] Verify SSL is working correctly
- [ ] Check monitoring dashboards
- [ ] Review logs for errors
- [ ] Test from external network
- [ ] Verify backup system is working

## Security Testing

### Headers Check
```bash
# Check security headers
curl -I https://yourdomain.com | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|Content-Security-Policy)"
```

### Rate Limiting Test
```bash
# Test rate limiting
for i in {1..150}; do curl -s -o /dev/null -w "%{http_code}\n" http://yourdomain.com/api/content/updates; done
# Should see 429 responses after hitting limit
```

### SSL Test
- Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
- Target grade: A or A+

### Security Headers Test
- Visit: https://securityheaders.com/?q=yourdomain.com
- Target grade: A or A+

### Vulnerability Scanning
```bash
# Scan Docker image
docker scan svmesh-site:latest

# Check for outdated packages
cd svmesh.client && npm audit
cd ../SVMesh.Server && dotnet list package --vulnerable
```

## Maintenance Schedule

### Daily
- [ ] Check application logs for errors
- [ ] Monitor system resources (CPU, RAM, Disk)
- [ ] Review access logs for suspicious activity

### Weekly
- [ ] Review security logs
- [ ] Check backup integrity
- [ ] Review monitoring alerts
- [ ] Update content as needed

### Monthly
- [ ] Update dependencies (after testing)
- [ ] Review and rotate logs
- [ ] Security audit
- [ ] Performance review
- [ ] Test disaster recovery procedures

### Quarterly
- [ ] Full security assessment
- [ ] Review access controls
- [ ] Update documentation
- [ ] Capacity planning review

## Emergency Procedures

### Application Down
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs --tail=100

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### Rollback Procedure
```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Pull previous working version
git checkout <previous-commit>

# Rebuild and deploy
docker build -t svmesh-site:latest .
docker-compose -f docker-compose.prod.yml up -d
```

### Security Incident
1. Isolate affected systems
2. Document the incident
3. Review logs for breach indicators
4. Notify stakeholders
5. Apply security patches
6. Review and update security measures
7. Conduct post-incident review

## Compliance & Documentation

- [ ] Document all configuration changes
- [ ] Keep inventory of all production secrets and where they're stored
- [ ] Maintain up-to-date architecture diagrams
- [ ] Document incident response procedures
- [ ] Keep security audit logs
- [ ] Maintain change log for production deployments

## Support Contacts

- **Application Owner**: [Name/Email]
- **System Administrator**: [Name/Email]
- **Security Contact**: [Name/Email]
- **On-Call Rotation**: [Schedule/Contact Method]

## Additional Resources

- [SVMesh Documentation](docs/README.md)
- [Security Guide](docs/security-guide.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Traefik Setup](docs/traefik-setup.md)

---

**Last Updated**: $(date +%Y-%m-%d)  
**Review Date**: [Set quarterly review date]
