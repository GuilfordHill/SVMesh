# SVMesh Deployment Guide

This guide provides step-by-step instructions for deploying SVMesh to production environments.

## Prerequisites

- Docker and Docker Compose installed
- Domain name (for Cloudflare Tunnel option)
- Cloudflare account (for Cloudflare Tunnel option)
- SSL certificates (for traditional deployment option)

## Deployment Options

### Option A: Cloudflare Tunnel (Recommended)

Cloudflare Tunnel provides secure, encrypted connections without exposing ports or managing SSL certificates.

#### Advantages
- No firewall configuration needed
- SSL handled automatically by Cloudflare
- DDoS protection included
- No open ports on your server
- Built-in security features

#### Setup Steps

1. **Create tunnel configuration file**
   ```bash
   # Create .env file if it doesn't exist
   cp .env.example .env
   ```

2. **Set up Cloudflare Tunnel**
   - Log in to [Cloudflare Dashboard](https://one.dash.cloudflare.com/)
   - Navigate to **Zero Trust > Access > Tunnels**
   - Click **Create a tunnel**
   - Choose **Cloudflared**
   - Give it a name (e.g., 'svmesh')
   - Install cloudflared connector (choose **Docker**)

3. **Configure tunnel hostname**
   - Add a public hostname:
     - **Subdomain**: your-subdomain (or leave blank for root domain)
     - **Domain**: your-domain.com
     - **Service Type**: HTTP
     - **URL**: `http://nginx:80`

4. **Get tunnel token**
   - Copy the tunnel token from the Docker run command
   - Example: `cloudflared tunnel --no-autoupdate run --token eyJhIjoiN...`
   - Copy everything after `--token `

5. **Configure environment variables**
   Edit `.env` file:
   ```bash
   CLOUDFLARE_TUNNEL_TOKEN=your_actual_token_here
   DOMAIN=your-domain.com
   ```

6. **Deploy application**
   ```bash
   # Create necessary directories
   mkdir -p ssl logs
   
   # Build Docker images
   docker-compose build --no-cache
   
   # Use Cloudflare-optimized nginx configuration
   cp nginx-cloudflare.conf nginx.conf.tunnel
   
   # Update docker-compose.yml to use tunnel config
   sed -i 's|./nginx.conf:/etc/nginx/nginx.conf:ro|./nginx.conf.tunnel:/etc/nginx/nginx.conf:ro|' docker-compose.yml
   
   # Start services
   docker-compose up -d
   
   # Wait for services to start
   sleep 10
   ```

7. **Verify deployment**
   ```bash
   # Check if nginx is responding
   docker exec svmesh-nginx curl -f http://localhost/
   
   # Check logs if needed
   docker-compose logs -f
   ```

### Option B: Traditional SSL Deployment

For deployments without Cloudflare Tunnel, you'll need to manage SSL certificates and firewall configuration.

#### Prerequisites
- SSL certificates (Let's Encrypt or custom)
- Domain pointing to your server
- Firewall properly configured

#### Setup Steps

1. **Prepare SSL certificates**

   **Option 1: Let's Encrypt (Recommended)**
   ```bash
   # Install certbot
   sudo apt update && sudo apt install certbot
   
   # Obtain certificates
   sudo certbot certonly --standalone -d your-domain.com
   
   # Copy certificates
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
   ```

   **Option 2: Custom certificates**
   ```bash
   # Place your certificates in the ssl directory
   cp your-certificate.pem ssl/fullchain.pem
   cp your-private-key.pem ssl/privkey.pem
   ```

2. **Update configuration files**
   
   **nginx.conf**: Replace `localhost` with your domain name
   
   **SVMesh.Server/Program.cs**: Update CORS origins to include your domain

3. **Deploy application**
   ```bash
   # Create directories
   mkdir -p ssl logs
   
   # Build images
   docker-compose build --no-cache
   
   # Start services
   docker-compose up -d
   
   # Wait for services
   sleep 10
   ```

4. **Verify deployment**
   ```bash
   # Test HTTP endpoint
   curl -f http://localhost/health
   
   # Test HTTPS endpoint (if SSL configured)
   curl -f https://localhost/health
   ```

## Post-Deployment Tasks

### Health Monitoring
```bash
# View real-time logs
docker-compose logs -f

# Check container status
docker-compose ps

# Restart services
docker-compose restart

# Stop services
docker-compose down
```

### Security Checklist

**For Cloudflare Tunnel deployments:**
- [ ] SSL/TLS handled automatically by Cloudflare
- [ ] No firewall ports need opening
- [ ] Configure Cloudflare security rules
- [ ] Review Cloudflare Access policies if using Zero Trust
- [ ] Regularly update Docker images
- [ ] Monitor logs for suspicious activity

**For traditional deployments:**
- [ ] Update domain names in `nginx.conf`
- [ ] Update CORS origins in `Program.cs`
- [ ] SSL certificates properly configured
- [ ] DNS pointing to your server
- [ ] Firewall configured (ports 80, 443 only)
- [ ] Consider fail2ban for additional protection
- [ ] Regularly update SSL certificates
- [ ] Monitor logs for suspicious activity

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Troubleshooting

**Common Issues:**

1. **SSL Certificate errors (traditional deployment)**
   ```bash
   # Check certificate validity
   openssl x509 -in ssl/fullchain.pem -text -noout
   
   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

2. **Service not responding**
   ```bash
   # Check container logs
   docker-compose logs nginx
   docker-compose logs svmesh-server
   
   # Restart services
   docker-compose restart
   ```

3. **Cloudflare Tunnel not working**
   - Verify tunnel token is correct in `.env`
   - Check Cloudflare dashboard for tunnel status
   - Ensure DNS is managed by Cloudflare
   - Check tunnel configuration in Cloudflare dashboard

## Environment Variables

Required environment variables in `.env` file:

```bash
# For Cloudflare Tunnel deployment
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token_here
DOMAIN=your-domain.com

# Database settings (if using)
# DATABASE_URL=your_database_url_here

# Application settings
# ASPNETCORE_ENVIRONMENT=Production
```

## Important Notes

- **Domain Requirements**: For Cloudflare Tunnel, your domain DNS must be managed by Cloudflare
- **Automatic DNS**: Tunnel creates CNAME records automatically
- **No Port Forwarding**: Cloudflare Tunnel eliminates need for port forwarding or SSL management
- **Security**: Both options provide robust security, but Cloudflare Tunnel offers additional DDoS protection
- **Monitoring**: Always monitor application logs and performance after deployment