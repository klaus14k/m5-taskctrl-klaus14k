import { prisma } from "../database/prisma"
import { TaskCreate, TaskReturn, TaskUpdate } from "../interfaces/task.interface"
import { taskSchema } from "../schemas/task.schema"

export class TaskService {
    public create = async ({category, ...payload}: TaskCreate): Promise<TaskReturn> => {
        if (!category){
            const newTask = await prisma.task.create({
                data: payload,
                include: {category: false}
                
            })
            return taskSchema.parse(newTask)
        }

        const { id } = await prisma.category.create({data: category})
        const newTask = await prisma.task.create({
            data: {...payload, categoryId: id},
            include: {category: true}
        })
        return taskSchema.parse(newTask)
    }

    public read = async (): Promise<Array<TaskReturn>> => {
        const allTasks = await prisma.task.findMany({include: {category: true}})
        
        return taskSchema.array().parse(allTasks)
    }

    public readById = async (taskId: string): Promise<TaskReturn> => {
        const task = await prisma.task.findFirst({include: {category: true}, where: {id: Number(taskId)}})

        return taskSchema.parse(task)
    }

    public update = async (taskId: string, {...payload}: TaskUpdate): Promise<TaskReturn> => {
        const updatedTask = await prisma.task.update({where: {id: Number(taskId)}, data: payload})

        return taskSchema.parse(updatedTask)
    }

    public delete = async (taskId: string): Promise<void> => {
        await prisma.task.delete({where: {id: Number(taskId)}})
    }
}