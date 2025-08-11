-- Script para crear la base de datos y tablas necesarias
-- Ejecuta este script en tu cliente MySQL (phpMyAdmin, MySQL Workbench, etc.)

CREATE DATABASE IF NOT EXISTS normalizacion;
USE normalizacion;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de inscripciones (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_inscripcion (usuario_id, curso_id)
);

-- Verificar que las tablas se crearon correctamente
SHOW TABLES;

-- Opcional: Insertar datos de prueba
INSERT IGNORE INTO usuarios (nombre, correo) VALUES 
('Juan Pérez', 'juan@email.com'),
('María García', 'maria@email.com');

INSERT IGNORE INTO cursos (nombre) VALUES 
('JavaScript'),
('Python'),
('Node.js');

-- Mostrar las tablas creadas
SELECT 'Usuarios creados:' as Info;
SELECT * FROM usuarios;

SELECT 'Cursos creados:' as Info;
SELECT * FROM cursos;

