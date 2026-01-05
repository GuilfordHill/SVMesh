# Multi-stage Docker build for SVMesh application
# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-build

# Ensure dev dependencies (TypeScript, etc.) are installed during the build
ENV NODE_ENV=development

WORKDIR /app/client

# Copy only package files first for better layer caching
COPY svmesh.client/package*.json ./
RUN npm ci --include=dev --prefer-offline --no-audit --legacy-peer-deps

# Copy environment configuration
COPY svmesh.client/.env* ./

# Copy only necessary source files (exclude node_modules, dist, etc.)
COPY svmesh.client/src ./src
COPY svmesh.client/public ./public
COPY svmesh.client/index.html ./
COPY svmesh.client/vite.config.ts ./
COPY svmesh.client/tsconfig*.json ./
COPY svmesh.client/eslint.config.js ./

# Build the application with production optimizations
RUN npm run build && npm cache clean --force

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS backend-build
WORKDIR /app/SVMesh.Server

# Copy only project file for restore (better caching)
COPY SVMesh.Server/*.csproj ./

# Restore dependencies in a separate layer with ReadyToRun disabled for faster builds
RUN dotnet restore --runtime linux-musl-x64

# Copy only necessary source files
COPY SVMesh.Server/*.cs ./
COPY SVMesh.Server/*.json ./
COPY SVMesh.Server/Properties/ ./Properties/
COPY SVMesh.Server/Controllers/ ./Controllers/
COPY SVMesh.Server/Services/ ./Services/
COPY SVMesh.Server/Models/ ./Models/

# Copy the built frontend from the previous stage
COPY --from=frontend-build /app/client/dist ./wwwroot

# Build and publish with optimizations
RUN dotnet publish -c Release -o /app/publish \
    --no-restore \
    --runtime linux-musl-x64 \
    --self-contained false \
    /p:PublishTrimmed=false \
    /p:PublishReadyToRun=false

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime

# Install curl for health check, ICU for globalization, and security updates in one layer
RUN apk add --no-cache curl icu-libs && \
    apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set up the application directory
WORKDIR /app
COPY --from=backend-build --chown=appuser:appgroup /app/publish .

# Copy pages directly into the app (not mounted)
COPY --chown=appuser:appgroup pages/ /app/wwwroot/content/pages/

# Create directories for content mounts and data
RUN mkdir -p /app/wwwroot/content/updates /app/data && \
    chown -R appuser:appgroup /app/wwwroot/content /app/data

# Copy default updates content to a separate location
COPY --chown=appuser:appgroup updates/ /app/updates.default/

# Copy the entrypoint script
COPY --chown=appuser:appgroup docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Remove any unnecessary files in one command
RUN find /app -type f \( -name "*.pdb" -o -name "*.xml" \) -delete

# Switch to non-root user
USER appuser

# Expose port (use non-privileged port)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables for production
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["dotnet", "SVMesh.Server.dll"]