import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";

export default function ProjectDetailsView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!; // el ! dice que si viene a fuerzas

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" />;

  if (data) {
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>

        <nav className="my-5 flex gap-3">
          <button
            type="button"
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + "?newTask=true")}
          >
            Agregar Tarea
          </button>
          <Link
            to={"team"}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          >
            Colaboradores
          </Link>
        </nav>
        <TaskList tasks={data.tasks} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
  }
}
