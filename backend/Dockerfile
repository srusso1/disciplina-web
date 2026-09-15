# Stage 1: Build Spring Boot package with Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image with Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Unprivileged system user for security compliance
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled artifact from builder stage
COPY --from=builder /app/target/disciplina-backend-*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

# Production container JVM tuning:
# - UseContainerSupport: respects cgroup memory and CPU limits
# - MaxRAMPercentage=75.0: allocates up to 75% of container RAM limit to JVM heap, leaving 25% for Metaspace/OS buffers
# - ExitOnOutOfMemoryError: ensures container crashes fast and restarts cleanly if OOM occurs
# - java.security.egd: non-blocking entropy source for fast startup
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
