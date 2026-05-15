import * as TarefaModel from "../models/tarefaModel.js";

export async function listarTarefas(req, res) {
  try {
    const tarefas = await TarefaModel.listarTarefas();
    res.json({ sucesso: true, dados: tarefas, total: tarefas.length });
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ erro: "Erro ao listar tarefas" });
  }
}

export async function buscarTarefaPorId(req, res) {
  try {
    const idNumero = Number(req.params.id);
    if (Number.isNaN(idNumero)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const tarefa = await TarefaModel.buscarTarefaPorId(idNumero);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json({ sucesso: true, dados: tarefa });
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).json({ erro: "Erro ao buscar tarefa" });
  }
}

export async function criarTarefa(req, res) {
  try {
    const { title, description, categoryId } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ erro: "Título é obrigatório" });
    }

    const tarefa = await TarefaModel.criarTarefa(title, description, categoryId);
    res.status(201).json({
      sucesso: true,
      mensagem: "Tarefa criada com sucesso!",
      dados: tarefa
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
}

export async function atualizarTarefa(req, res) {
  try {
    const idNumero = Number(req.params.id);
    if (Number.isNaN(idNumero)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ erro: "Nenhum campo para atualizar" });
    }

    const tarefa = await TarefaModel.atualizarTarefa(idNumero, req.body);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json({
      sucesso: true,
      mensagem: "Tarefa atualizada com sucesso!",
      dados: tarefa
    });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
}

export async function excluirTarefa(req, res) {
  try {
    const idNumero = Number(req.params.id);
    if (Number.isNaN(idNumero)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const tarefa = await TarefaModel.excluirTarefa(idNumero);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json({
      sucesso: true,
      mensagem: "Tarefa excluída com sucesso!",
      dados: tarefa
    });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ erro: "Erro ao excluir tarefa" });
  }
}
