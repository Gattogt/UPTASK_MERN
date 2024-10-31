import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from '@/api/ProjectAPI'
import AddTaskModal from '@/components/tasks/AddTaskModal'
import TaskList from '@/components/tasks/TaskList'
import EditTaskData from '@/components/tasks/EditTaskData'
import TaskModalDetails from '@/components/tasks/TaskModalDetails'

export default function ProjectDetailsView() {
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId!

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
    retry: false // this is done that if it is a error it will not try to make the connection 3 times
  })
  if (isLoading) return 'Cargando...'
  if (isError) return <Navigate to='/404' />

  if (data) return (
    <>
      <h1 className='text-5xl font-black'>{data.projectName}</h1>
      <p className='text-2xl font-light mt-5 text-gray-500'>{data.description}</p>
      <nav className='my-5 flex gap-3'>
        <button
          type='button'
          className='bg-purple-500 hover:bg-purple-600 px-10 py-3
           text-white text-xl font-bold cursor-pointer transition-colors'
          onClick={() => navigate(location.pathname + '?newTask=true')}
        >
          Agregar Tarea
        </button>
      </nav>
      <TaskList
        tasks={data.tasks}
      />
      <AddTaskModal />
      <EditTaskData />
      <TaskModalDetails />
    </>
  )
}

