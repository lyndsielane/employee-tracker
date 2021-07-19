const inquirer = require('inquirer');
const EmployeeDatabase = require('./employeeDatabase');
const CFonts = require('cfonts');

let db;

async function init() {
    CFonts.say('Employee|Manager', {
        font: 'block',
        align: 'left',
        gradient: 'red,green',
        independentGradient: true
    });

    db = new EmployeeDatabase();

    let action;

    while (action !== "Quit") {
        const response = await inquirer.prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View all employees", 
                    "View employees by department", 
                    "View employees by manager", 
                    "Add employee",
                    "Remove employee",
                    "Update employee role",
                    "Update employee manager",
                    "View all departments",
                    "Add department",
                    "Quit"
                ],
                name: "choice"
            }
        ]);

        action = response.choice;

        switch (response.choice) {
            case "View all departments":
                db.getDepartments();
                break;
            case "Add department":
                await createDepartment();
                break;
        }
    }
}

async function createDepartment() {
    const response = await inquirer.prompt([
        {
            type: "input",
            message: "What is the department name?",
            name: "name"
        }
    ]);

    db.createDepartment(response.name);
}

init();