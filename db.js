import fs from "fs";

import chalk from "chalk";

const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class DB {
  static createDB() {
    if (fs.existsSync(process.env.DB_FILE_NAME)) {
      console.log(warn("File exists !"));
      return false;
    }
    try {
      fs.writeFileSync(process.env.DB_FILE_NAME, "[]", "utf-8");
      console.log(success("File created successfully ..."));
      return true;
    } catch (error) {
      throw new Error("Database file not created !");
    }
  }

  static resetDB() {
    try {
      fs.writeFileSync(process.env.DB_FILE_NAME, "[]", "utf-8");
      return true;
    } catch (e) {
      throw new Error("Database file not reseted!");
    }
  }

  static DBExists() {
    if (fs.existsSync(process.env.DB_FILE_NAME)) {
      return true;
    } else {
      return false;
    }
  }

  static getById(id) {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        console.log(e.message);
      }
    }
    try {
      const finder = data.find((item) => item.id === Number(id));
      return finder ? finder : false;
    } catch (e) {
      throw new Error("sintax error \n please check your DB file");
    }
  }

  static getByTitle(title) {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        console.log(e.message);
      }
    }
    try {
      const titleFinder = data.find((item) => item.title === title);
      return titleFinder ? titleFinder : false;
    } catch (e) {
      throw new Error("sintax error \n please check your DB file");
    }
  }

  static getAll() {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        console.log(e.message);
      }
    }
    return data;
  }

  static createTask(title, completed = false) {
    if (typeof title !== "string" || title.length < 3) {
      throw new Error("title must be a string and less than 3 characters");
    } else if (typeof completed !== "boolean") {
      throw new Error("cimpleted is not a booleann !");
    }
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        console.log(e.message);
      }
    }
    const checkTitle = DB.getByTitle(title);
    if (checkTitle) throw new Error("please send a new title");
    try {
      const task = {
        id: data[data.length - 1].id + 1,
        title,
        completed,
      };
      data.push(task);
      fs.writeFileSync(
        process.env.DB_FILE_NAME,
        JSON.stringify(data, null, "    "),
        "utf-8"
      );
      return task;
    } catch (e) {
      throw new Error("sintax error \n please check your DB file");
    }
  }

  static completedTask(title, completed) {
    if (typeof title !== "string" || title.length < 3) {
      throw new Error("title must be a string and less than 3 characters");
    }
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        console.log(e.message);
      }
    }
    try {
      const task = data.find((item) => item.title === title);
      if (completed === task.completed) {
        console.log(warn(`defult completed is ${completed} !`));
      } else {
        task.completed = completed;
        fs.writeFileSync(
          process.env.DB_FILE_NAME,
          JSON.stringify(data, null, "    "),
          "utf-8"
        );
        return task;
      }
    } catch (e) {
      throw new Error("sintax error \n please check your DB file");
    }
  }

  static taskEditor(title, completed = false, id) {
    if (typeof title !== "string" || title.length < 3) {
      throw new Error("title must be a string and less than 3 characters");
    } else if (typeof completed !== "boolean") {
      throw new Error("cimpleted is not a booleann !");
    }
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        console.log(e.message);
      }
    }
    const checkTitle = DB.getByTitle(title);
    if (checkTitle && checkTitle.id !== id)
      throw new Error("please send a new title");
    try {
      if (id > data.length) {
        throw new Error("task not found !");
      }
      const task = data.find((item) => item.id === id);
      task.title = title;
      task.completed = completed;
      fs.writeFileSync(
        process.env.DB_FILE_NAME,
        JSON.stringify(data, null, "    "),
        "utf-8"
      );
      return task;
    } catch (e) {
      throw new Error("sintax error \n please check your DB file");
    }
  }

  static deleteTaskById(id) {
    if (!id) throw new Error("please send a id for delete task !");
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        throw new Error(e.message);
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1);
        try {
          fs.writeFileSync(
            process.env.DB_FILE_NAME,
            JSON.stringify(data, null, "    "),
            "utf-8"
          );
          return true;
        } catch (error) {
          throw new Error(
            "sintax error \n can't write to db " + process.env.DB_FILE_NAME
          );
        }
      }
    }
  }

  static deleteTaskByTitle(title) {
    if (!title) throw new Error("please send a title for delete tsask");
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(process.env.DB_FILE_NAME, "utf-8");
      data = JSON.parse(data);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        throw new Error(e.message);
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].title === title) {
        data.splice(i, 1);
        try {
          fs.writeFileSync(
            process.env.DB_FILE_NAME,
            JSON.stringify(data, null, "    "),
            "utf-8"
          );
          return true;
        } catch (error) {
          throw new Error(
            "sintax error \n can't write to db " + process.env.DB_FILE_NAME
          );
        }
      }
    }
  }
}
