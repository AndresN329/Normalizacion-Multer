const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require('./proyecto/uploads/db');

const app = express();

// Middleware CORS para permitir peticiones del frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Configuración Multer
const upload = multer({ dest: 'uploads/' });

// 📌 Ruta para subir y procesar CSV
app.post('/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('❌ No se ha seleccionado ningún archivo');
  }

  const resultados = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      // Ejemplo: datos crudos del CSV
      // { nombre: 'Juan', correo: 'juan@mail.com', curso: 'Node.js' }

      // Limpieza básica
      const nombre = row.nombre.trim();
      const correo = row.correo.toLowerCase();
      const curso = row.curso.trim();

      resultados.push({ nombre, correo, curso });
    })
    .on('end', async () => {
      console.log('📄 CSV leído. Normalizando...');

      try {
        for (const dato of resultados) {
          // Validar datos
          if (!dato.nombre || !dato.correo || !dato.curso) {
            console.log('⚠️ Saltando fila con datos incompletos:', dato);
            continue;
          }

          // Inserta en tabla usuarios evitando duplicados por correo
          await new Promise((resolve, reject) => {
            db.query(
              'INSERT IGNORE INTO usuarios (nombre, correo) VALUES (?, ?)',
              [dato.nombre, dato.correo],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          // Inserta en tabla cursos evitando duplicados por nombre
          await new Promise((resolve, reject) => {
            db.query(
              'INSERT IGNORE INTO cursos (nombre) VALUES (?)',
              [dato.curso],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          // Inserta en inscripciones (relación)
          await new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO inscripciones (usuario_id, curso_id) VALUES ((SELECT id FROM usuarios WHERE correo = ?), (SELECT id FROM cursos WHERE nombre = ?))',
              [dato.correo, dato.curso],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        }

        // Borrar archivo temporal
        fs.unlinkSync(req.file.path);

        res.send(`✅ Datos subidos y normalizados correctamente. Procesadas ${resultados.length} filas.`);
      } catch (error) {
        console.error('❌ Error procesando datos:', error);
        
        // Borrar archivo temporal en caso de error
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        res.status(500).send('❌ Error procesando los datos: ' + error.message);
      }
    })
    .on('error', (error) => {
      console.error('❌ Error leyendo CSV:', error);
      
      // Borrar archivo temporal en caso de error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).send('❌ Error leyendo el archivo CSV: ' + error.message);
    });
});

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
