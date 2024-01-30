import util from "util";

import chalk from "chalk";

import DB from "./db.js";

export default class Task {
  #id = 0;
  #title ;
  #completed;
  constructor(title, completed = false) {
    this.title = title;
    this.completed = completed;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get completed() {
    return this.#completed;
  }

  set completed(value) {
    this.#completed = value;
  }

  set title(value) {
    this.#title = value;
  }

  create() {
    try {
      DB.createTask(this.#title, this.#completed);
    } catch (e) {
      throw new Error(e.message);
    }
  }
  [util.inspect.custom]() {
    return `Task {
      id : ${chalk.yellowBright.bold(this.id)},
      title : ${chalk.greenBright.bold('"' + this.title + '"')},
      completed : ${chalk.blueBright.bold(this.completed)},
}`;
  }

  save(id) {
    try {
      return DB.taskEditor(this.#title, this.#completed, id);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static delete(id) {
    try {
      const task = DB.deleteTaskById(id);
      if(!task) throw new Error('Task not found')
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static delete_all() {
    try {
      DB.resetDB();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static getTaskById(id) {
    const task = DB.getById(id);
    if(task){
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      return item;
    }else{
      return false;
    }
  }

  static getTaskByTitle(title) {
    const task = DB.getByTitle(title);
    if(task){
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      return item;
    }else{
      return false;
    }
  }

  static getAllTasks(rowObject = false){
    let tasks = DB.getAll()
    if(rowObject = true){
      return tasks
    }
    let items = []
    for(let task of tasks){
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      items.push(item)
    }
    return items
  }
}
