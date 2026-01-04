# SVMesh Production Quick Start

This guide will help you deploy SVMesh securely in production in under 30 minutes.

## Prerequisites

- Linux server (Ubuntu 20.04+ or similar)
- Docker and Docker Compose installed
- Domain name pointed to your server
- Root or sudo access

## Step 1: Initial Setup (5 minutes)

```bash
# Clone the repository
git clone <your-repo-url> /opt/svmesh
cd /opt/svmesh

# Create environment file
cp .env.example .env

# Edit with your actual values
nano .env
```

**Minimum required configuration:**
```env
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ASPNETCORE_ENVIRONMENT=Production
```

## Step 2: Configure Traefik Integration (2 minutes)

Since you're running behind a Traefik proxy on a separate machine, ensure Traefik is configured to forward requests to this nginx instance.

**On your Traefik machine**, add routing configuration:
```yaml
# Example Traefik configuration (on your Traefik server)
http:
  routers:
    svmesh:
      rule: "Host(`yourdomain.com`)"
      service: svmesh-backend
      tls:
        certResolver: letsencrypt
  services:
    svmesh-backend:
      loadBalancer:
        servers:
          - url: "http://your-svmesh-server-ip:8081"
```

**On this machine**, ensure:
- Port 8081 (or your configured NGINX_PORT) is accessible from Traefik server
- Firewall allows traffic from Traefik server IP

## Step 3: Build Application (5 minutes)

```bash
# Build Docker image
docker build -t svmesh-site:latest .

# Verify build completed
docker images | grep svmesh
```

## Step 4: Deploy (2 minutes)

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Step 5: Verify Deployment (5 minutes)

```bash
# Test health endpoint (direct to app)
curl http://localhost:8080/health
# Expected: Healthy

# Test nginx (internal)
curl -I http://localhost:8081
# Expected: 200 OK

# Test from external network (through Traefik)
curl -I https://yourdomain.com
# Expected: 200 OK with security headers from both Traefik and nginx
```

### Verify Security Headers

Visit https://securityheaders.com/?q=yourdomain.com

Expected headers:
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy
- ✅ Referrer-Policy

## Step 6: Add Content (3 minutes)

```bash
# Create content directories
mkdir -p /opt/svmesh/pages
mkdir -p /opt/svmesh/updates

# Add your markdown files
cp your-content/*.md /opt/svmesh/pages/
cp your-updates/*.md /opt/svmesh/updates/

# Restart to pick up new content
docker-compose -f docker-compose.prod.yml restart
```

## Common Issues & Solutions

### 🔴 Port 80/443 already in use
```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting service
sudo systemctl stop apache2  # or nginx
sudo systemctl disable apache2
```

### 🔴 Container permission errors
```bash
# Fix ownership
sudo chown -R 1001:1001 /opt/svmesh/pages
sudo chown -R 1001:1001 /opt/svmesh/updates
```

### 🔴 Cannot reach application through Traefik
```bash
# Verify nginx is accessible from Traefik server
# Run from Traefik server:
curl -I http://your-svmesh-server-ip:8081

# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# Verify firewall rules
sudo ufw status
sudo iptables -L -n | grep 8081
```

### 🔴 CORS errors in browser
```bash
# Verify ALLOWED_ORIGINS is set correctly
cat .env | grep ALLOWED_ORIGINS

# Must include protocol (https://)
# Must NOT include trailing slash
```

## Security Verification

Run these commands to verify security:

```bash
# 1. Check container is running as non-root
docker exec svmesh-app id
# Expected: uid=1001(appuser) gid=1001(appgroup)

# 2. Test rate limiting
for i in {1..150}; do curl -s -o /dev/null -w "%{http_code}\n" https://yourdomain.com/api/content/updates; done
# Expected: 429 errors after ~100 requests

# 3. Verify read-only filesystem
docker exec svmesh-app touch /app/test.txt
# Expected: Permission denied or read-only filesystem error

# 4. Check security options
docker inspect svmesh-app | grep -A5 SecurityOpt
# Expected: no-new-privileges:true
```

## Monitoring Setup (Optional)

### Basic Monitoring
```bash
# Monitor container resources
docker stats

# Watch logs in real-time
docker-compose -f docker-compose.prod.yml logs -f --tail=50

# Check disk space
df -h
```

### Advanced Monitoring (Recommended)
- Set up uptime monitoring: UptimeRobot, Pingdom, or StatusCake
- Configure log aggregation: ELK stack, Loki, or CloudWatch
- Set up alerts: PagerDuty, OpsGenie, or email notifications

## Backup Strategy

```bash
# Backup content files
tar -czf svmesh-backup-$(date +%Y%m%d).tar.gz /opt/svmesh/pages /opt/svmesh/updates /opt/svmesh/.env

# Backup to remote location
rsync -avz /opt/svmesh/pages backup-server:/backups/svmesh/
rsync -avz /opt/svmesh/updates backup-server:/backups/svmesh/
```

## Updates & Maintenance

### Update Application
```bash
cd /opt/svmesh
git pull
docker build -t svmesh-site:latest .
docker-compose -f docker-compose.prod.yml up -d
```

### Update Dependencies
```bash
# Update base images
docker pull mcr.microsoft.com/dotnet/aspnet:8.0-alpine
docker pull node:20-alpine
docker pull nginx:alpine

# Rebuild with updated images
docker build --no-cache -t svmesh-site:latest .
```

## Support

- 📖 Full documentation: [docs/README.md](docs/README.md)
- 🔒 Security guide: [docs/SECURITY.md](docs/SECURITY.md)
- ✅ Production checklist: [docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md)
- 🐛 Issues: Create a GitHub issue

## Next Steps

1. ✅ Complete [docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md)
2. 📊 Set up monitoring and alerting
3. 🔄 Schedule regular backups
4. 📱 Configure uptime monitoring
5. 🔐 Enable automatic security updates:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

---

**Deployment Time**: ~20 minutes (SSL handled by Traefik)  
**Security Level**: Production-ready ✅  
**Architecture**: Nginx backend behind Traefik proxy 🔄

For detailed security hardening, review [docs/SECURITY.md](docs/SECURITY.md).
