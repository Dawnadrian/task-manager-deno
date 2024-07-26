import { TaskManager } from "./TaskManager.ts";

const taskManager = new TaskManager();

async function main() {
    while (true) {
        console.log("\nTask Manager");
        console.log("1. Add Task");
        console.log("2. Delete Task");
        console.log("3. Print Tasks");
        console.log("4. Exit");

        const choice = await prompt("Choose an option: ");

        switch (choice) {
            case "1":
                const title = await prompt("Enter task title: ");
                const description = await prompt("Enter task description: ");
                if (title && description) {
                    taskManager.addTask(title, description);
                } else {
                    console.log("Both title and description are required.");
                }
                break;

            case "2":
                const id = await prompt("Enter task ID to delete: ");
                if (id) {
                    taskManager.deleteTask(parseInt(id));
                } else {
                    console.log("Task ID is required.");
                }
                break;

            case "3":
                taskManager.printTasks();
                break;

            case "4":
                Deno.exit(0);

            default:
                console.log("Invalid choice. Please try again.");
        }
    }
}

main();
