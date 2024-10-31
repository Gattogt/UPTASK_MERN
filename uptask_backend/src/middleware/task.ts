import Task, { ITask } from '../models/Task';
import { Request, Response, NextFunction } from 'express'

declare global{
  namespace Express{
    interface Request{
      task: ITask;
    } 
  }
}

export async function validateTaskExists(req:Request, res:Response, next:NextFunction) {
  try {
    const { taskId } = req.params
    const task = await Task.findById(taskId)
    if (!task) {
      const error = new Error('Tarea no encontrada')
      return res.status(404).json({ error: error.message })
    }
    req.task = task
    next();
    
  } catch (error) {
    res.status(500).json({error: "Intern al Error"})
  }
} 
export function taskBelongsToProject(req:Request, res:Response, next:NextFunction) {
  if (req.task.project.toString() !== req.project.id.toString()) {
        const error = Error('Accion no valida este projecto no te pertence')
        return res.status(400).json({error: error.message})
  }
  next()
}