import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, TaskFormData, Task } from "../types";

type TaskApiType = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
};

export async function createTask({
  formData,
  projectId,
}: Pick<TaskApiType, "formData" | "projectId">) {
  try {
    const url = `/projects/${projectId}/tasks`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskApiType, "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const { data } = await api(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateTask({
  projectId,
  taskId,
  formData,
}: Pick<TaskApiType, "projectId" | "taskId" | "formData">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskApiType, "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
