package com.disciplina;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class DisciplinaWebApplication {

    public static void main(String[] args) {
        // Cargar variables de entorno desde .env si existe en la raiz o en backend
        try {
            File rootEnv = new File("../.env");
            File currentEnv = new File(".env");
            Dotenv dotenv = null;
            if (rootEnv.exists()) {
                dotenv = Dotenv.configure().directory("../").ignoreIfMissing().load();
            } else if (currentEnv.exists()) {
                dotenv = Dotenv.configure().ignoreIfMissing().load();
            }

            if (dotenv != null) {
                dotenv.entries().forEach(entry -> {
                    if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                        System.setProperty(entry.getKey(), entry.getValue());
                    }
                });
            }
        } catch (Exception ignored) {
            // En producci�n los secretos provienen de las variables de entorno del contenedor
        }

        SpringApplication.run(DisciplinaWebApplication.class, args);
    }
}
