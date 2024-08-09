import { Task } from "./task.ts";
export class TaskManager {


   private tasks: Task[] = [];
   private kv: Deno.Kv;




    constructor() {
       this.intialize();
    }


    private async intialize() {
       this.kv = await Deno.openKv();
        await this.loadTasks();
    }


  
   // checks if there is a current tasks file in kv store. if so- will load new tasks, else- will create an empty array.
   private async loadTasks(): Promise<void> {
       try {
          const res = await this.kv.get(["tasks"]);
          if(res.value){
           this.tasks = res.value as Task[];
          } else{
           console.log("no tasks were found in kv store, starting an empty list");
           this.tasks = [];
          }


       } catch(error){
           console.error("error loading tasks from kv store: ", error);
           this.tasks = [];
       }
   }


 
  
    // adding a new task from the user's tasks array
     addTask( title: string, description: string): void {
       console.log("current tasks: ", this.tasks)
       const newId = this.tasks.length + 1; // assigning a new id number
       const newTask = new Task(newId,title,description); // creating a new task object
       this.tasks.push(newTask); // pushing it to tasks array
       console.log(`new task added: ${title}`);
       this.saveTasks(this.tasks); // saving the updated array
   }




   // saving the task in the kv store
   private async saveTasks(taskslist: Task[]): Promise<void> {
       try {
           await this.kv.set(["tasks"], taskslist); //setting a new task in the kv store


       } catch(error) {
           console.error("error saving tsks :" , error);
       }
       console.log("new task saved");
    }




    // prints the tasks and their status


    printTasks(): void {
       this.tasks.forEach(task => {
           console.log(`task ID:${task.id} - ${task.title} - ${task.description} [${task.completed ? "completed" : "pending"}]`);
       });


    }
  


    // deletes a task from the deno kv store by specific id of task:
     async deleteTask(idToBeDeleted: number): Promise<void> {
       try {
           const tempValues = await this.kv.get(["tasks"]);
           const currentTaskList = tempValues.value as Task[] || []; // if temp.values is undefined it will be cast to an empty array
           const updatedTaskList = currentTaskList.filter(task => task.id !== idToBeDeleted); //filtering the array by id
           await this.saveTasks(updatedTaskList); // using ths saveTasks() method to save the new array


       } catch(error) {
           console.error("error deleting task : ", error);
       }
      


    }


}

