import express from "express";
import * as TarefaController from "../controllers/tarefaController.js";

const router = express.Router();

router.get("/tarefas", TarefaController.listarTarefas);
router.get("/tarefas/:id", TarefaController.buscarTarefaPorId);
router.post("/tarefas", TarefaController.criarTarefa);
router.put("/tarefas/:id", TarefaController.atualizarTarefa);
router.delete("/tarefas/:id", TarefaController.excluirTarefa);

export default router;
