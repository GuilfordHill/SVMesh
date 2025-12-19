# Cloudflare Tunnel Setup for SVMesh

This document provides detailed instructions for setting up Cloudflare Tunnel with SVMesh, offering secure, encrypted connections without exposing ports or managing SSL certificates.

## Overview

Cloudflare Tunnel creates secure connections between your server and Cloudflare's edge network without opening inbound ports on your firewall. This provides:

- **Zero Trust security model**
- **Automatic SSL/TLS encryption**
- **DDoS protection**
- **No firewall configuration required**
- **Built-in load balancing**
- **Access control capabilities**

## Prerequisites

- Cloudflare account with a domain
- Domain DNS managed by Cloudflare
- Docker and Docker Compose installed
- SVMesh application ready for deployment

## Step-by-Step Setup

### 1. Prepare Environment

Create environment configuration:
```bash
# Create .env file if it doesn't exist
cp .env.example .env
```

### 2. Create Cloudflare Tunnel

1. **Access Cloudflare Dashboard**
   - Navigate to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
   - Select your account/domain

2. **Navigate to Tunnels**
   - Go to **Zero Trust** → **Access** → **Tunnels**
   - Click **Create a tunnel**

3. **Choose Tunnel Type**
   - Select **Cloudflared**
   - This uses the cloudflared connector

4. **Name Your Tunnel**
   - Enter a descriptive name (e.g., `svmesh-production`)
   - Click **Save tunnel**

### 3. Install Connector

1. **Choose Installation Method**
   - Select **Docker** tab (recommended for SVMesh)

2. **Note the Command**
   - Cloudflare will show a Docker run command
   - Example: `docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token eyJhIjoiN...`
   - **Important**: Copy the token part (`eyJhIjoiN...`) - you'll need this

### 4. Configure Public Hostname

1. **Add Public Hostname**
   - In the tunnel configuration, click **Add a public hostname**

2. **Set Hostname Details**
   - **Subdomain**: Enter your desired subdomain (e.g., `app`) or leave blank for root domain
   - **Domain**: Select your domain from dropdown
   - **Service**: 
     - Type: **HTTP**
     - URL: `http://nginx:80`

3. **Advanced Settings (Optional)**
   - **HTTP Host Header**: Set to your domain if needed
   - **Origin Server Name**: Leave blank unless using custom certificates
   - **TLS Settings**: Use defaults

4. **Save Configuration**

### 5. Configure SVMesh Environment

Edit your `.env` file:

```bash
# Cloudflare Tunnel Configuration
CLOUDFLARE_TUNNEL_TOKEN=your_actual_token_from_step_3
DOMAIN=your-domain.com

# Optional: Additional settings
ASPNETCORE_ENVIRONMENT=Production
```

**Important Notes:**
- Replace `your_actual_token_from_step_3` with the actual token from Cloudflare
- Replace `your-domain.com` with your actual domain
- Do not include quotes around the token

### 6. Prepare Nginx Configuration

SVMesh includes a Cloudflare-optimized nginx configuration:

```bash
# Copy Cloudflare-optimized config
cp nginx-cloudflare.conf nginx.conf.tunnel
```

This configuration:
- Handles Cloudflare headers properly
- Sets appropriate proxy headers
- Optimizes for tunnel connections
- Includes security headers

### 7. Deploy Application

```bash
# Create necessary directories
mkdir -p ssl logs

# Build Docker images
docker-compose build --no-cache

# Update docker-compose.yml to use tunnel config
sed -i 's|./nginx.conf:/etc/nginx/nginx.conf:ro|./nginx.conf.tunnel:/etc/nginx/nginx.conf:ro|' docker-compose.yml

# Start services
docker-compose up -d

# Wait for services to initialize
sleep 10
```

### 8. Verify Tunnel Connection

1. **Check Cloudflare Dashboard**
   - Return to the Tunnels section
   - Your tunnel should show as **Healthy**
   - Status should be **Active**

2. **Test Local Connection**
   ```bash
   # Test nginx is responding internally
   docker exec svmesh-nginx curl -f http://localhost/
   
   # Check application logs
   docker-compose logs -f
   ```

3. **Test Public Access**
   - Visit your configured domain (e.g., `https://app.your-domain.com`)
   - SSL should work automatically
   - Application should load properly

## Configuration Details

### Docker Compose Integration

The tunnel runs as part of your Docker Compose stack:

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
    networks:
      - svmesh-network
```

### Nginx Configuration for Tunnels

Key differences in `nginx-cloudflare.conf`:

```nginx
# Trust Cloudflare IP ranges
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
# ... (additional Cloudflare IP ranges)

# Use Cloudflare headers for real IP
real_ip_header CF-Connecting-IP;

# Proxy headers for backend
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header CF-Ray $http_cf_ray;
proxy_set_header CF-Visitor $http_cf_visitor;
```

## Advanced Configuration

### Multiple Hostnames

You can configure multiple hostnames for the same tunnel:

1. **Add Additional Hostname**
   - In tunnel configuration, click **Add a public hostname**
   - Configure different subdomains (e.g., `api.your-domain.com`)
   - Point to different internal services if needed

### Access Policies

Implement Zero Trust access controls:

1. **Navigate to Access Policies**
   - Go to **Zero Trust** → **Access** → **Applications**
   - Click **Add an application**

2. **Configure Application**
   - **Application type**: Self-hosted
   - **Application domain**: Your tunnel hostname
   - Set up authentication requirements

### Custom Headers

Add custom headers in tunnel configuration:
- **HTTP Host Header**: Override host header sent to origin
- **Origin Server Name**: For custom SSL verification
- **Additional Headers**: Custom headers for your application

## Troubleshooting

### Common Issues

1. **Tunnel Shows Inactive**
   ```bash
   # Check token is correct in .env
   grep CLOUDFLARE_TUNNEL_TOKEN .env
   
   # Restart cloudflared service
   docker-compose restart cloudflared
   
   # Check cloudflared logs
   docker-compose logs cloudflared
   ```

2. **SSL Certificate Errors**
   - Ensure domain DNS is managed by Cloudflare
   - Check SSL/TLS settings in Cloudflare dashboard
   - Verify tunnel is active and healthy

3. **502 Bad Gateway**
   ```bash
   # Check nginx is running
   docker-compose ps nginx
   
   # Verify internal service connectivity
   docker exec svmesh-nginx curl -f http://localhost/
   
   # Check network configuration
   docker network ls
   ```

4. **Real IP Not Showing**
   - Verify nginx configuration includes Cloudflare IP ranges
   - Check `real_ip_header` setting
   - Ensure `nginx-cloudflare.conf` is being used

### Monitoring and Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f cloudflared
docker-compose logs -f nginx
docker-compose logs -f svmesh-server

# Check tunnel status
curl -H "Host: your-domain.com" http://localhost/health
```

## Security Considerations

### Tunnel Security
- Tunnels use mutual TLS authentication
- All traffic encrypted end-to-end
- No inbound ports exposed on server
- Cloudflare provides DDoS protection

### Access Control
- Implement Cloudflare Access for additional security
- Use IP restrictions if needed
- Monitor access logs in Cloudflare dashboard
- Set up alerts for suspicious activity

### Best Practices
1. **Rotate tunnel tokens** periodically
2. **Monitor tunnel health** in dashboard
3. **Use Access policies** for sensitive applications
4. **Keep cloudflared updated** (automatic with Docker image)
5. **Implement application-level security** in addition to tunnel security

## Migration from Traditional Setup

If migrating from a traditional setup:

1. **Update DNS**: Remove A records pointing to your server IP
2. **Remove Port Forwarding**: Close ports 80/443 on firewall
3. **Update Configuration**: Switch to tunnel-optimized nginx config
4. **Test Thoroughly**: Ensure all functionality works through tunnel
5. **Update Monitoring**: Adjust any monitoring that checked direct server access

## Cost Considerations

- Cloudflare Tunnel is **free** for basic usage
- Bandwidth costs apply for high-traffic sites
- Zero Trust features may require paid plans
- Consider usage patterns when planning deployment