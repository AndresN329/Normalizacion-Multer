# 🚀 Instrucciones para conectar Frontend con Base de Datos

## 📋 Problemas solucionados:

1. ✅ **Ruta corregida**: Arreglé la importación de `db.js` en `server.js`
2. ✅ **CORS agregado**: Ahora el frontend puede conectarse al backend
3. ✅ **Package.json creado**: Con todas las dependencias necesarias
4. ✅ **Manejo de errores mejorado**: Mejor control de errores y validación de datos

## 🛠️ Pasos para configurar y probar:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Verificar que MySQL esté funcionando
- Asegúrate de que MySQL esté ejecutándose en tu sistema
- Verifica que la base de datos 'normalizacion' exista
- Confirma que las credenciales en `db.js` sean correctas

### 3. Crear las tablas necesarias (ejecutar en MySQL)
```sql
CREATE DATABASE IF NOT EXISTS normalizacion;
USE normalizacion;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    curso_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id),
    UNIQUE KEY unique_inscripcion (usuario_id, curso_id)
);
```

### 4. Ejecutar el servidor
```bash
npm start
```

### 5. Abrir el frontend
- Abre `frontend.html` en tu navegador
- Selecciona un archivo CSV
- Haz clic en "Subir"

## 📁 Formato esperado del CSV
Tu archivo CSV debe tener estas columnas:
```
nombre,correo,curso
Juan Pérez,juan@email.com,JavaScript
María García,maria@email.com,Python
```

## 🔍 Verificar funcionamiento
- El servidor debe mostrar "✅ Conectado a MySQL" al iniciar
- Deberías ver mensajes de procesamiento en la consola
- El frontend debe mostrar "✅ Datos subidos y normalizados correctamente"

## ⚠️ Posibles problemas y soluciones:

1. **Error de conexión MySQL**:
   - Verifica usuario/contraseña en `db.js`
   - Asegúrate de que MySQL esté ejecutándose

2. **Error CORS**:
   - Ya solucionado con el middleware agregado

3. **Módulos no encontrados**:
   - Ejecuta `npm install`

4. **Puerto ocupado**:
   - Cambia el puerto 3000 por otro en `server.js`

