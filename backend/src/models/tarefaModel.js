import { pool } from "../config/database.js";

export async function listarTarefas() {
  try {
    const [tarefas] = await pool.query(
      "SELECT t.*, c.name as categoryName FROM Task t LEFT JOIN Category c ON t.categoryId = c.id ORDER BY t.createdAt DESC"
    );
    return tarefas;
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    throw error;
  }
}

export async function buscarTarefaPorId(id) {
  try {
    const [tarefas] = await pool.query(
      "SELECT t.*, c.name as categoryName FROM Task t LEFT JOIN Category c ON t.categoryId = c.id WHERE t.id = ?",
      [id]
    );
    return tarefas.length > 0 ? tarefas[0] : null;
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    throw error;
  }
}

export async function criarTarefa(title, description = null, categoryId = null) {
  try {
    const [result] = await pool.query(
      "INSERT INTO Task (title, description, categoryId, completed, createdAt) VALUES (?, ?, ?, false, NOW())",
      [title.trim(), description ? description.trim() : null, categoryId]
    );
    return await buscarTarefaPorId(result.insertId);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
}

export async function atualizarTarefa(id, data) {
  try {
    const updates = [];
    const values = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      values.push(data.title.trim());
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description ? data.description.trim() : null);
    }
    if (data.completed !== undefined) {
      updates.push("completed = ?");
      values.push(data.completed);
    }
    if (data.categoryId !== undefined) {
      updates.push("categoryId = ?");
      values.push(data.categoryId);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const query = `UPDATE Task SET ${updates.join(", ")} WHERE id = ?`;
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) return null;
    return await buscarTarefaPorId(id);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    throw error;
  }
}

export async function excluirTarefa(id) {
  try {
    const tarefa = await buscarTarefaPorId(id);
    if (!tarefa) return null;

    await pool.query("DELETE FROM Task WHERE id = ?", [id]);
    return tarefa;
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    throw error;
  }
}
