import type { Request, Response } from 'express'
import Project from '../models/Project';
import Task from '../models/Task';
import { ITask } from '../models/Task';

export class TaskController{
  static createTask = async(req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id
      req.project.tasks.push(task.id)
      await Promise.allSettled([task.save(), req.project.save()])
      res.send('tarea creada correctamente')

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error })
    }
  }

  // Get Task By Project or task where project is the same
  static getProjectTask = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({project: req.project.id}).populate('project')
      res.json(tasks)

    } catch (error) {
      res.status(500).json({ error: "Hubo un error" })
    }
  }
  // Get a task by ID
  static getTaskById = async (req: Request, res: Response) => {
    try {
      res.json(req.task)
    } catch (error) {
      res.status(500).json({error:"Tarea no encontrada"})
    }
  }

  //Update a task
  static updateTask = async (req:Request, res:Response) => {
    req.task.name = req.body.name
    req.task.description = req.body.description
    await req.task.save()
    res.send("Tarea actualizada correctamente")

  }

  // Delete a task
  static deleteTask = async (req:Request, res:Response) => {
    try {
      // remove the task from the project.
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id)
      await Promise.allSettled([req.task.deleteOne(), req.project.save()])
      res.send('Tarea eliminada correctamente')
     } catch (error) {
       res.status(500).json({ error: error.message })
     }
  }

  // This is another way to validate when you do not want to use a custom middleware
  static updateStatus = async (req:Request, res:Response) => {
    try {
      const {taskId } = req.params
      const { status } = req.body
      
      const task = await Task.findById(taskId)
      if (!task) {
        const error = new Error('La tarea no existe')
        return res.status(404).json({error: error.message})
      }
      task.status = status
      await task.save()
      res.send('Tarea actualizada')
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}