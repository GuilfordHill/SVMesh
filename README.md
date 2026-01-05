# SVMesh

The upcoming website for the Susquehanna Valley Mesh, serving the centeral Pennsylvania region.

### Technology Stack

**Frontend:**

- React 19 with TypeScript
- Material-UI (MUI) for components and styling
- React Router for navigation
- Vite for build tooling and development
- React Markdown for content rendering

**Backend:**

- ASP.NET Core 8.0
- Swagger/OpenAPI for API documentation
- Built-in health checks
- CORS and security middleware

**Infrastructure:**

- Docker containers for all services
- Nginx reverse proxy with security headers
- Support for SSL/TLS termination
- Traefik reverse proxy integration
- Multi-stage Docker builds for optimization

## Building SVMesh

We use Docker to run the app stack, with a Docker Compose file provided. After cloning the repository, run `docker compose up -d --build` to run the site. By default, the site will be available on port 8081.

## Project Structure

```
svmesh/
├── configs/                       # Deployment configs (nginx/traefik)
│   └── nginx.conf.traefik
├── docs/                          # Operations and security docs
├── pages/                         # Markdown pages served at /content/pages
├── updates/                       # Markdown update posts served at /content/updates
├── SVMesh.Server/                 # ASP.NET Core backend
│   ├── Controllers/
│   ├── Properties/
│   ├── Services/                  # Handlers for content and Discord integration
│   ├── Program.cs
│   └── SVMesh.Server.csproj
├── svmesh.client/                 # React frontend (Vite + MUI)
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.yml             # Default compose (production-like)
├── Dockerfile
├── nginx.conf                     # Local nginx config
├── QUICKSTART.md                  # Quick run instructions
└── README.md                      # This file
```

## Configuration

### Environment Variables

Create a `.env` file by copying `.env.example` and update it for your configuration:

```bash
# Domain Configuration
DOMAIN=your-domain.com

# Nginx Port (for Traefik to connect to)
NGINX_PORT=8081

# Application settings
ASPNETCORE_ENVIRONMENT=Production

# Database (if using)
# DATABASE_URL=your_database_url

...
```

### Application Settings

Key configuration files:

- `SVMesh.Server/appsettings.json` - Backend configuration
- `svmesh.client/vite.config.ts` - Frontend build configuration
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Reverse proxy settings

## Development

### Local Development Setup

1. **Install dependencies**

   ```bash
   # Backend dependencies
   cd SVMesh.Server
   dotnet restore

   # Frontend dependencies
   cd ../svmesh.client
   npm install
   ```

2. **Run in development mode**

   ```bash
   # Terminal 1 - Backend
   cd SVMesh.Server
   dotnet run

   # Terminal 2 - Frontend
   cd svmesh.client
   npm run dev
   ```

3. **Build for production**

   ```bash
   # Build all containers
   docker compose build

   # Run production build locally
   docker compose up
   ```

## Monitoring and Maintenance

### Log Management

Logs are available through Docker Compose:

```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f svmesh-server
docker-compose logs -f nginx
```

### Updates and Maintenance

```bash
# Update to latest version
git pull
docker compose build
docker compose up -d
```

## Documentation

Documentation is available in the `docs/` directory, covering how to best format Markdown pages to integrate seamlessly with the current rendering engine. If you are planning to contribute to page contents, please read and follow the guidelines.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
- Frontend powered by [React](https://reactjs.org/) and [Material-UI](https://mui.com/)
- Containerization with [Docker](https://www.docker.com/)
- Reverse proxy on the production site with [Traefik](https://traefik.io/)
