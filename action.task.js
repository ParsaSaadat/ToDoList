import fs, { writeFileSync } from "fs";
import util from "util";

import inquirer from "inquirer";
import chalk from "chalk";
import { stringify } from "csv";
import axios from "axios";
import Task from "./task.js";
import { writeFile } from "fs/promises";

const err = chalk.redBright.bold,
  success = chalk.greenBright.bold;

export default class Action {
  static list() {
    const tasks = Task.getAllTasks(true);
    if (tasks.length) {
      console.table(tasks);
    } else {
      console.log(err("There is not any task !"));
    }
  }

  static async add() {
    const title = await inquirer.prompt({
      type: "input",
      name: "title",
      message: "Enter the title of the task : ",
      validate: (value) => {
        if (value < 3) {
          const message = `${err("please enter a task on 3 character title")}`;
          console.log(message);
          return false;
        }
        return true;
      },
    });
    const completed = await inquirer.prompt({
      type: "confirm",
      name: "completed",
      message: "Is the task completed ?",
      default: false,
    });
    try {
      const message = `${success(title.title + " task created successfully")}`;
      const task = new Task(title.title, completed.completed);
      task.create();
      console.log(message);
      return true;
    } catch (e) {
      console.log(err(e.message));
    }
  }

  static async delete() {
    const tesks = Task.getAllTasks();
    let choices = [];
    for (let task of tesks) {
      choices.push(task.title);
    }
    const title = await inquirer.prompt({
      type: "list",
      name: "title",
      message: "Enter the title of the task : ",
      choices,
    });
    const task = Task.getTaskByTitle(title.title);
    try {
      const message = `${success(task.title + " task deleted successfully")}`;
      Task.delete(task.id);
      console.log(message);
    } catch (e) {
      console.log(err(e.message));
    }
  }

  static async delete_all() {
    const answers = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: "Are you sure you want to delete all tasks?",
      default: false,
    });
    if (answers.confirm) {
      try {
        const message = `${success("deleted all tasks successfully")}`;
        Task.delete_all();
        console.log(message);
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  static async edit() {
    const Tasks = Task.getAllTasks();
    let choices = [];

    for (let i = 0; i < Tasks.length; i++) {
      choices.push(Tasks[i].title);
    }
    const answer_task = await inquirer.prompt([
      {
        type: "list",
        name: "title",
        message: "Enter the title of the task : ",
        choices,
      },
    ]);

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "newTitle",
        message: "Enter the title of the task : ",
        validate: (value) => {
          if (value < 3 && typeof value === "string") {
            const message = `${err(
              "please enter a task on 3 character title"
            )}`;
            console.log(message);
            return false;
          }
          return true;
        },
        default: answer_task.title,
      },
      {
        type: "confirm",
        name: "completed",
        message: "Is the task completed ?",
        default: true,
      },
    ]);

    const id = Task.getTaskByTitle(answer_task.title);
    try {
      const task = new Task(answers.newTitle, answers.completed);
      console.table(task.save(Number(id.id)));
    } catch (e) {
      console.log(err(e.message));
    }
  }

  static async import() {
    const answers = await inquirer.prompt({
      type: "input",
      name: "url",
      message: "Enter the url of the task : ",
    });
    try {
      const res = await axios.get(answers.url);
      if (res.data instanceof Object) {
        fs.writeFileSync(
          process.env.DB_FILE_NAME,
          JSON.stringify(res.data, null, "    "),
          "utf-8"
        );
      } else {
        throw new Error("your url response is not a json data");
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static async export() {
    const answers = await inquirer.prompt({
      type: "input",
      name: "filename",
      default: "copy-data.csv",
    });

    const tasks = Task.getAllTasks(true);
    let data;
    stringify(tasks, { header: true }, (err, csvDats) => {
      try {
        fs, writeFileSync(answers.filename, csvDats);
      } catch (e) {
        throw new Error(e.message);
      }
    });
  }
}
