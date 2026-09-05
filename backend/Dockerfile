# Etapa 1: Compilacion y empaquetado del artefacto Spring Boot
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cachear dependencias copiando pom.xml primero
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar codigo fuente y compilar saltando pruebas
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final de ejecucion optimizada
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Crear usuario sin privilegios para ejecucion segura
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/disciplina-backend-*.jar app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
