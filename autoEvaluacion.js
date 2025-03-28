const fs = require("fs/promises");
const readline = require("readline");
const yargs = require("yargs");

const argv = yargs.option("file", {
  alias: "f",
  type: "string",
  default: "productos.json",
  describe: "Nombre del archivo JSON donde se guardarán los productos",
}).argv;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pregunta = (texto) => {
  return new Promise((resolve, reject) => {
    rl.question(texto, (respuesta) => {
      if (!respuesta) {
        reject(new Error("La respuesta no puede estar vacía"));
      }
      resolve(respuesta);
    });
  });
};

const obtenerDatosProducto = async () => {
  try {
    const nombre = await pregunta("Producto: ");
    const precio = parseFloat(await pregunta("Precio: "));
    const cantidad = parseInt(await pregunta("Cantidad: "), 10);

    if (isNaN(precio) || isNaN(cantidad)) {
      throw new Error("El precio o la cantidad no son válidos");
    }

    return { nombre, precio, cantidad };
  } catch (error) {
    throw new Error(`Error al obtener datos del producto: ${error.message}`);
  }
};

const leerArchivo = async (file) => {
  try {
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw new Error(`Error al leer el archivo: ${error.message}`);
  }
};

const escribirArchivo = async (file, data) => {
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
    console.log(`Producto guardado en ${file}`);
  } catch (error) {
    throw new Error(`Error al escribir en el archivo: ${error.message}`);
  }
};

const main = async () => {
  try {
    const producto = await obtenerDatosProducto();
    let productos = await leerArchivo(argv.file);

    productos.push(producto);

    await escribirArchivo(argv.file, productos);

    const contenidoFinal = await fs.readFile(argv.file, "utf-8");
    console.log("Contenido actual del archivo:", contenidoFinal);
  } catch (error) {
    console.error("Ocurrió un error:", error.message);
  } finally {
    rl.close();
  }
};

main();
