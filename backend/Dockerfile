# ---- Stage 1: build the jar with Maven ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Download dependencies first so this layer is cached when only source code changes.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
# Tests need PostgreSQL, so they run in CI and via scripts/mvn, not during the image build.
RUN mvn -B -q package -DskipTests

# ---- Stage 2: small runtime image with only the JRE ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user. The upload folder is owned by that user so a volume mounted there is writable.
RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /app/uploads && chown app:app /app/uploads

COPY --from=build /build/target/eventfund-backend-*.jar app.jar

USER app
EXPOSE 8080

# Use at most half of the container's memory for the heap (the EC2 host has only 2 GB).
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=50", "-jar", "app.jar"]
