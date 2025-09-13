# Dockerfile

# jdk17 Image Start
FROM eclipse-temurin:17-jdk

ARG JAR_FILE=build/libs/backend-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} backend.jar
ENTRYPOINT ["java","-jar","-Duser.timezone=Asia/Seoul","backend.jar"]