import { prisma } from "../config/prisma.js";

export async function listarTarefas() {
  try {
    return await prisma.task.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    throw error;
  }
}

export async function buscarTarefaPorId(id) {
  try {
    const tarefa = await prisma.task.findUnique({
      where: { id },
      include: { category: true }
    });
    return tarefa;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao buscar tarefa:", error);
    throw error;
  }
}

export async function criarTarefa(title, description = null, categoryId = null) {
  try {
    return await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        categoryId
      },
      include: { category: true }
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
}

export async function atualizarTarefa(id, data) {
  try {
    const tarefa = await prisma.task.update({
      where: { id },
      data: {
        title: data.title ? data.title.trim() : undefined,
        description: data.description !== undefined ? (data.description ? data.description.trim() : null) : undefined,
        completed: data.completed !== undefined ? data.completed : undefined,
        categoryId: data.categoryId !== undefined ? data.categoryId : undefined
      },
      include: { category: true }
    });
    return tarefa;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao atualizar tarefa:", error);
    throw error;
  }
}

export async function excluirTarefa(id) {
  try {
    return await prisma.task.delete({
      where: { id },
      include: { category: true }
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao excluir tarefa:", error);
    throw error;
  }
}