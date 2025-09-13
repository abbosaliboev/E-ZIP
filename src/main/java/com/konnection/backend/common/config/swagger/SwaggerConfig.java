package com.konnection.backend.common.config.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {

        Server server = new Server();
        server.setUrl("https://api.ezip.kro.kr");
        //server.setUrl("http://localhost:8080");

        return new OpenAPI()
                .info(new Info()
                        .title("E-ZIP")
                        .description("E-ZIP REST API Document - Backend Developer : 태근")
                        .version("1.0.0"))
                .addServersItem(server)
                .components(new Components());
    }

}