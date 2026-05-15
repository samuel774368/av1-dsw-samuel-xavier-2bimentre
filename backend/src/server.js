import app from "./app.js";
import { pool } from "./config/database.js";

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("Conexão bem-sucedida com o banco de dados!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

main();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});