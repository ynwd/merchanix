FROM denoland/deno:latest

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Cache the application (this will create a new lock file)
RUN deno cache main.ts

# Expose port
EXPOSE 8000

# Set user to non-root for security
USER deno

# Run the application
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "--watch", "main.ts"]