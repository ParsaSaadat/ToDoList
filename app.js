console.clear();

import "dotenv/config.js";
import chalk from "chalk";

import Action from "./action.task.js";

const warn = chalk.yellowBright.bold,
  err = chalk.redBright.bold,
  success = chalk.greenBright.bold;

const comend = process.argv[2];
const comends = [
  "list",
  "add",
  "delete",
  "delete-all",
  "edit",
  "export",
  "import",
];

if (comend) {
  if (comend === "list") {
    Action.list();
  } else if (comend === "delete") {
    Action.delete();
  } else if (comend === "delete-all") {
    Action.delete_all();
  } else if (comend === "add") {
    Action.add();
  } else if (comend === "edit") {
    Action.edit();
  } else if (comend === "export") {
    Action.export();
  } else if (comend === "import") {
    Action.import();
  } else {
    const message = `${err("please send a avaliable comend")}
avalible comend are :
${warn(comends.join("\n"))}`;
    console.log(message);
  }
} else {
  const message = `${err("you are must enter a comend")}
avalible comend are :
${warn(comends.join("\n"))}`;
  console.log(message);
}
