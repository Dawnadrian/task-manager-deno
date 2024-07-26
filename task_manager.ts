import { Task } from "./task.ts";
export class task_manager {

    private tasks: Task[] = [];
    private filePath: string = "./src/tasks/tasks.json";

    constructor(){
        this.loadTasks();
    }

    // loads the json file of the user's tasks every time the program is running
    private async loadTasks(): Promise<void> {
        try {
            const taskData = await Deno.readTextFile(this.filePath);
            this.tasks = JSON.parse(taskData) as Task[];
        } catch(error) {
            if(error instanceof Deno.errors.NotFound) {
                console.log("no tasks file found, starting an empty list of tasks");
                this.tasks = []
            } else {
                console.error("error loading tasks: ", error);
            }
        }
    }

   
    
     // adding a new task from the user
      addTask( title: string, descritption: string): void {
        const newId = this.tasks.length + 1;
        const newTask = new Task(newId,title,descritption);
        this.tasks.push(newTask);
        console.log(`new task added: ${title}`);
        this.saveTasks();
    }


    // saving the task in the json file
    private async saveTasks(): Promise<void> {
        try {
            const data = JSON.stringify(this.tasks, null, 2);
            await Deno.writeTextFile(this.filePath,data);
        } catch(error) {
            console.error("error saving tsks :" , error);
        }
     }


     // prints the tasks and their status

     printTsks(): void {
        this.tasks.forEach(task => {
            console.log(`task ID:${task.id} - ${task.title} - ${task.description} [${task.completed ? "completed" : "pending"}]`);
        });

     }
    

     // deletes the tasks:
     private async deleteTask(idToBeDeleted: number): Promise<void> {
        try {
        const taskToBeDeletedData = await Deno.readTextFile(this.filePath);
        const taskArray = JSON.parse(taskToBeDeletedData) as Task[];

        const updatedTasksList = taskArray.filter(task => task.id !== idToBeDeleted);
        const updatedData = JSON.stringify(updatedTasksList, null ,2);
        await Deno.writeTextFile(this.filePath, updatedData);

        console.log(`task with id ${idToBeDeleted} deleted`);
        } catch(error) {
            console.error("error deleting task : ", error);
        }
        

     }

 }