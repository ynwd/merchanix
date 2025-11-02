FROM denoland/deno:latest

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Cache the application (this will create a new lock file)
RUN deno cache app.ts

# Ensure /deno-dir is writable by the deno user
RUN chown -R deno:deno /deno-dir

# Expose port
EXPOSE 8000

# Set user to non-root for security
USER deno

# Run the application
CMD ["deno", "run", "-A", "--unstable-kv", "main.ts"]