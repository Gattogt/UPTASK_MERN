import { Router } from 'express';
import { body, param} from 'express-validator'
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExists } from '../middleware/project';
import {taskBelongsToProject, validateTaskExists} from '../middleware/task'
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';

const router = Router();
router.get('/', authenticate, ProjectController.getAllProjects)

router.post('/',
  authenticate,
  body('projectName').notEmpty().withMessage('the project name is required'),
  body('clientName').notEmpty().withMessage('the project client is required'),
  body('description').notEmpty().withMessage('the description is required'),
  handleInputErrors,
  ProjectController.createProject)

router.get('/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID not valid'),
  handleInputErrors,
  ProjectController.getProjectById)

router.put('/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID no valido'),
  body('projectName').notEmpty().withMessage('the project name is required'),
  body('clientName').notEmpty().withMessage('the project client is required'),
  body('description').notEmpty().withMessage('the description is required'),
  handleInputErrors,
  ProjectController.updateProject
)
router.delete('/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID NO VALIDO'),
  handleInputErrors,
  ProjectController.deleteProject)

/** Route for tasks */ 

router.post('/:projectId/tasks',
  validateProjectExists,
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  handleInputErrors,
  TaskController.createTask)

router.get('/:projectId/tasks', validateProjectExists, TaskController.getProjectTask)
/**************************************************************************************** */
router.get('/:projectId/tasks/:taskId',
  validateProjectExists,
  validateTaskExists,
  taskBelongsToProject,
  handleInputErrors,
  TaskController.getTaskById)
/*************************************************************************************** */

router.put('/:projectId/tasks/:taskId',
  validateProjectExists,
  validateTaskExists,
  taskBelongsToProject,
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  handleInputErrors,
  TaskController.updateTask)
/*************************************************************************************** */

router.delete('/:projectId/tasks/:taskId',
  validateProjectExists,
  validateTaskExists,
  taskBelongsToProject,
  param('taskId').isMongoId().withMessage('No a valid ID'),
  handleInputErrors,
  TaskController.deleteTask)
/*************************************************************************************** */
 
  
router.post('/:projectId/tasks/:taskId/status',
  validateProjectExists,
  validateTaskExists,
  taskBelongsToProject,
  param('taskId').isMongoId().withMessage('No a valid ID'),
  body('status').notEmpty().withMessage('El estatus es obligatorio'),
  handleInputErrors,
  TaskController.updateStatus)


/** Routes for teams */
router.post('/:projectId/team/find',
  authenticate,
  validateProjectExists,
  body('email').isEmail().toLowerCase().withMessage('E-mail no valido'),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team',
  authenticate,
  validateProjectExists,
  body('id').isMongoId().withMessage('Id no valido'),
  handleInputErrors,
  TeamMemberController.addUserById
)

export default router;