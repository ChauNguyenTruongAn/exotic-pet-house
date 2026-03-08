# =========================
# BUILD STAGE
# =========================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom trước để tận dụng cache
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN mvn -B -q dependency:go-offline

# Copy source & build
COPY src src
RUN mvn -B -q clean package -DskipTests


# =========================
# RUNTIME STAGE
# =========================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy jar từ build stage
COPY --from=build /app/target/*.jar app.jar

# JVM options tối ưu cho Render Free (512MB)
ENV JAVA_TOOL_OPTIONS="-Xms128m -Xmx256m \
-XX:MaxMetaspaceSize=96m \
-XX:ReservedCodeCacheSize=64m \
-Xss512k \
-XX:+UseSerialGC"

# Port Spring Boot
EXPOSE 8080

# Run app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
