import chalk from "chalk";
import figlet from "figlet";

const bannerText = figlet.textSync("ROLT", {
  font: "Ansi Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
});

console.log(chalk.magentaBright.bold(bannerText));
