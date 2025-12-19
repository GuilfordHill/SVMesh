# SVMesh Documentation

Welcome to the SVMesh documentation. This directory contains comprehensive guides for deploying, configuring, and maintaining your SVMesh application.

## Documentation Overview

### [Deployment Guide](deployment-guide.md)
Complete guide for deploying SVMesh to production environments with two main options:
- **Cloudflare Tunnel** (recommended): Secure, encrypted connections without port management
- **Traditional SSL**: Standard HTTPS deployment with manual certificate management

### [Cloudflare Tunnel Setup](cloudflare-tunnel-setup.md)
Detailed walkthrough for setting up Cloudflare Tunnel integration:
- Step-by-step tunnel creation
- DNS and hostname configuration  
- Advanced tunnel features and troubleshooting
- Security considerations and best practices

### [Security Guide](security-guide.md)
Comprehensive security documentation covering:
- Container and application security
- Network hardening and SSL/TLS configuration
- Infrastructure security and monitoring
- Production security checklist
- Incident response procedures

### [Markdown Guide](markdown-guide.md)
Complete reference for content creation and formatting:
- Standard markdown syntax with Material-UI styling
- Special banner components (info, warning, critical)
- Frontmatter configuration for pages and updates
- Content organization and best practices
- Examples and formatting guidelines

## 🚀 Quick Start

For new deployments, start with the [Deployment Guide](deployment-guide.md). If you want the simplest and most secure setup, follow the Cloudflare Tunnel option.

### Recommended Deployment Flow

1. **Choose Deployment Method**
   - For maximum security and simplicity: [Cloudflare Tunnel Setup](cloudflare-tunnel-setup.md)
   - For traditional hosting: Traditional SSL section in [Deployment Guide](deployment-guide.md)

2. **Follow Security Guidelines**
   - Review the [Security Guide](security-guide.md) for hardening steps
   - Implement monitoring and logging
   - Configure appropriate access controls

3. **Post-Deployment**
   - Verify all security measures are in place
   - Set up monitoring and alerting
   - Document your specific configuration

## Migration from Scripts

This documentation replaces the previous deployment scripts:

- **`deploy.sh`** → [Deployment Guide](deployment-guide.md)
- **`setup-tunnel.sh`** → [Cloudflare Tunnel Setup](cloudflare-tunnel-setup.md)
- **Security considerations** → [Security Guide](security-guide.md)

The documentation provides the same functionality with more detailed explanations, troubleshooting guidance, and security best practices.

## Prerequisites

Before following any deployment guide, ensure you have:

- **Docker and Docker Compose** installed
- **Domain name** (for public deployments)
- **Cloudflare account** (for tunnel deployments)
- **SSL certificates** (for traditional deployments)
- **Server with appropriate resources**

## Document Structure

Each guide includes:
- **Prerequisites** - What you need before starting
- **Step-by-step instructions** - Detailed deployment steps
- **Configuration examples** - Copy-paste configurations
- **Troubleshooting** - Common issues and solutions
- **Security considerations** - Best practices and hardening
- **Monitoring and maintenance** - Ongoing operational guidance

## Getting Help

- **General setup issues**: Check the troubleshooting sections in each guide
- **Security concerns**: Review the [Security Guide](security-guide.md)
- **Cloudflare-specific issues**: See [Cloudflare Tunnel Setup](cloudflare-tunnel-setup.md)
- **Application bugs**: Create a GitHub issue in the main repository

## Additional Resources

- [SVMesh Repository](../README.md) - Main project documentation
- [Docker Documentation](https://docs.docker.com/) - Container platform docs
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) - Official tunnel documentation
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL certificates

## Keeping Documentation Updated

This documentation is maintained alongside the codebase. When updating configurations or deployment procedures:

1. Update the relevant documentation files
2. Test the documented procedures
3. Update version numbers and dates where applicable
4. Ensure all links and references are current

---

*Last updated: December 2025*