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
            case "View all employees":
                db.viewEmployees();
                break;
            case "View employees by department":
                await viewEmployeesByDepartment();
                break;
            case "View employees by manager":
                await viewEmployeesByManager()
                break;
            case "Add employee":
                await addEmployee()
                break;
            case "Remove employee":
                await removeEmployee()
                break;
            case "Update employee role":
                await updateEmployeeRole()
                break;
            case "View all departments":
                db.viewDepartments();
                break;
            case "Add department":
                await createDepartment();
                break;
        }
    }
}

async function viewEmployeesByDepartment() {
    // get department names
    var departmentNames = await db.getDepartments();

    // create inquirer with the available department names as choices
    var response = await inquirer.prompt([{
        type: "list",
        message: "Which department?",
        choices: departmentNames,
        name: "departmentName"
    }]);

    // get employees that are under that department
    db.viewEmployeesByDepartment(response.departmentName);
}

async function viewEmployeesByManager() {
    var managerNames = await db.getManagers();

    var response = await inquirer.prompt([{
        type: "list",
        message: "Which manager?",
        choices: managerNames,
        name: "managerName"
    }]);

    db.viewEmployeesByManager(response.managerName);
}

async function addEmployee() {
    var managerNames = await db.getManagers();
    var roleNames = await db.getRoles();
    managerNames.push("none");

    const response = await inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is the employee's role?",
            choices: roleNames,
            name: "role"
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            choices: managerNames,
            name: "manager"
        }
    ]);

    await db.addEmployee(response.firstName, response.lastName, response.role, response.manager);
}

async function removeEmployee() {
    var getEmployees = await db.getEmployees();

    const response = await inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to remove?",
            choices: getEmployees,
            name: "employeeName"
        }
    ])

    await db.removeEmployee(response.employeeName);
}

async function updateEmployeeRole() {
    var getEmployees = await db.getEmployees();
    var roles = await db.getRoles();

    const response = await inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update?",
            choices: getEmployees,
            name: "employeeName"
        },
        {
            type: "list",
            message: `What role would you like to assign the employee?`,
            choices: roles,
            name: "newRole"
        }
    ])

    await db.updateEmployeeRole(response.employeeName, response.newRole);
}

async function createDepartment() {
    const response = await inquirer.prompt([
        {
            type: "input",
            message: "What is the department name?",
            name: "name"
        }
    ]);

    db.createDepartment(response.department);
}

init();