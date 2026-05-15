import mysql from "mysql2/promise";
import "dotenv/config";

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || ""
  });

  try {
    const dbName = process.env.DATABASE_NAME;

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database "${dbName}" criado/verificado`);

    // Select database
    await connection.changeUser({ database: dbName });

    // Create Category table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Tabela 'Category' criada/verificada");

    // Create Task table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Task (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        categoryId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE SET NULL
      )
    `);
    console.log("✓ Tabela 'Task' criada/verificada");

    // Create User table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Tabela 'User' criada/verificada");

    // Create Post table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Post (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT,
        published BOOLEAN DEFAULT FALSE,
        authorId INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
      )
    `);
    console.log("✓ Tabela 'Post' criada/verificada");

    console.log("\n✓ Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
