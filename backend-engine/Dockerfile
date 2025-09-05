FROM eclipse-temurin:17-jre

WORKDIR /app
COPY target/*.jar app.jar

EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["java", "-jar", "app.jar"]
