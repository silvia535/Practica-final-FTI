const fs = require('fs').promises;

async function leerArchivoCSV() {
  try {
    const data = await fs.readFile('datos.csv', 'utf8');
    console.log('Contenido del archivo CSV:');
    console.log(data);
  } catch (error) {
    console.error('Error al leer el archivo:', error.message);
  }
}

leerArchivoCSV();
