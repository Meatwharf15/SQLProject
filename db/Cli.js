import inquirer from "inquirer";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const SQL_PORT = process.env.Port
const {Pool, Client} = pg;

const pool = new Pool({
  user: process.env.SQL_USER,
  host: 'localhost',
  port: 5432,
  database: 'business_db',
});

async function query(sql, args = []) {
    const client = await pool.connect();

// "try" will make it so that the code inside of it won't crash.
// "catch(e)" converts the error into a value, and console.error(e) logs it. "e" is an exception type.
// Whatever happens inside "try", whether the code works or not, "finally" will always be called.
    try {
        const result = await client.query(sql, args);
        return result;
    } catch(e) {
        console.error(e);
    } finally {
        client.release();
    }
}

const Cli = async () => {
        const answers = await inquirer
          .prompt([
            {
              type: 'list',
              name: 'companyActions',
              message: 'What would you like to do?',
              choices: ['View Departments', "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"],
            },
          ]);
            if (answers.companyActions === 'View Departments') {
                const result = await query("SELECT * FROM department");
                const departments = result.rows;
                console.log("\n");
                console.table(departments);
                return true;
            } else if (answers.companyActions === "View Roles") {
                const result = await query("SELECT * FROM role");
                const roles = result.rows;
                console.log("\n");
                console.table(roles);
                return true;
            } else if (answers.companyActions === "View Employees") {
                const result = await query("SELECT * FROM employee");
                const employees = result.rows;
                console.log("\n");
                console.table(employees);
                return true;
            } else if (answers.companyActions === "Add Department") {
                let inputMaybe = await inquirer.prompt({
                    type: 'input',
                    name: 'newDepartment',
                    message: 'Enter the name of the new department.',
                });
                const result = await query("INSERT INTO department(name) VALUES($1)", [inputMaybe.newDepartment]);
                // Everything in VALUES() here has to be "$number", from 1 onwards. Everything after the first comma respresents which variables correspond in that order.
                const departments = result.rows;
                console.log("\n");
                console.table(departments);
                return true;
            } else if (answers.companyActions === "Add Role") {
                let inputMaybe = await inquirer.prompt({
                    type: 'input',
                    name: 'newTitle',
                    message: 'Enter the new job title.',
                });
                let inputPerhaps = await inquirer.prompt({
                    type: 'input',
                    name: 'newSalary',
                    message: 'Enter the new job salary.',
                });
                const result = await query("INSERT INTO role(title, salary) VALUES($1, $2)", [inputMaybe.newTitle, inputPerhaps.newSalary]);
                const roles = result.rows;
                console.log("\n");
                console.table(roles);
                return true;
            } else if (answers.companyActions === "Add Employee") {
                let inputMaybe = await inquirer.prompt({
                    type: 'input',
                    name: 'newFirst',
                    message: 'Enter the first name of the new employee.',
                });
                let inputPerhaps = await inquirer.prompt({
                    type: 'input',
                    name: 'newLast',
                    message: 'Enter the last name of the new employee.',
                });
                let inputConceivably = await inquirer.prompt({
                    type: 'input',
                    name: 'role_id',
                    message: 'Enter the job title of the new employee.',
                }); 
                let inputPossibly = await inquirer.prompt({
                    type: 'input',
                    name: 'manager',
                    message: 'If employee is a manager, type null. If not, what is the ID of their manager?',
                });
                const result = await query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3)", [inputMaybe.newFirst, inputPerhaps.newLast, inputConceivably.role_id, inputPossibly.manager]);
                return true;
            } else if (answers.companyActions === "Update Employee Role") {
                const jobs = await query("SELECT title, id FROM role");
                const workers = await query("SELECT first_name, last_name, id FROM employee");
                const workerChoices = workers.map(worker => {
                    let parseWorker = {name: worker.first_name + " " + worker.last_name, value: worker.id}; 
                    return parseWorker
                });
                const jobChoices = jobs.map(job => {
                    let parseJob = {name: job.title, value: job.id};
                    return parseJob
                })
                const answers = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'updateRole',
                        message: 'What employee would you like to update?',
                        choices: workerChoices
                    },
                ])
// This could be a simple prompt for anything the user inputs as a job, it's just that this is easier to validate if the database was official.
                    let newJob = await inquirer.prompt([
                        {
                            type: "list",
                            name: "giveJob",
                            message: "What job would you like to give them?",
                            choices: jobChoices
                        },
                    ]);
                await query("UPDATE employee SET role_id = $1 WHERE id = $2", [newJob.giveJob.id, answers.updateRole.id]);
                return true;
            } else if (answers.companyActions === "Quit") {
                return false;
            }
    }
//}

export default Cli;