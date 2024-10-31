import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from '@/api/ProjectAPI'
import EditProjectForm from '@/components/projects/EditProjectForm'

export default function EditProjectView() {
  const params = useParams()
  const projectId = params.projectId!

  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId],
    queryFn: () => getProjectById(projectId),
    retry: false // this is done that if it is a error it will not try to make the connection 3 times
  })
  if (isLoading) return 'Cargando...'
  if (isError) return <Navigate to='/404' />

  if (data) return (<EditProjectForm data={data} projectId={projectId} />)
}
