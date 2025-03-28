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
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => resolve(respuesta));
  });
};

const main = async () => {
  try {
    const nombre = await pregunta("Producto: ");
    const precio = parseFloat(await pregunta("Precio: "));
    const cantidad = parseInt(await pregunta("Cantidad: "), 10);

    const producto = { nombre, precio, cantidad };
    let productos = [];

    try {
      const data = await fs.readFile(argv.file, "utf-8");
      productos = JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    productos.push(producto);

    await fs.writeFile(argv.file, JSON.stringify(productos, null, 2));
    console.log(`Producto guardado en ${argv.file}`);

    const contenidoFinal = await fs.readFile(argv.file, "utf-8");
    console.log("Contenido actual del archivo:", contenidoFinal);
  } catch (error) {
    console.error("Ocurrió un error:", error.message);
  } finally {
    rl.close();
  }
};

main();
