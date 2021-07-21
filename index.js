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
            case "Update employee manager":
                await updateEmployeeManager()
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
    var departments = await db.getDepartments();

    // create inquirer with the available department names as choices
    var response = await inquirer.prompt([{
        type: "list",
        message: "Which department?",
        choices: departments,
        name: "departmentId"
    }]);

    // get employees that are under that department
    db.viewEmployeesByDepartment(response.departmentId);
}

async function viewEmployeesByManager() {
    var managers = await db.getManagers();

    var response = await inquirer.prompt([{
        type: "list",
        message: "Which manager?",
        choices: managers,
        name: "managerId"
    }]);

    db.viewEmployeesByManager(response.managerId);
}

async function addEmployee() {
    var managers = await db.getManagers();
    var roles = await db.getRoles();
    managers.push({ name: "none", value: null });

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
            choices: roles,
            name: "roleId"
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            choices: managers,
            name: "managerId"
        }
    ]);

    await db.addEmployee(response.firstName, response.lastName, response.roleId, response.managerId);
}

async function removeEmployee() {
    var employees = await db.getEmployees();

    const response = await inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to remove?",
            choices: employees,
            name: "employeeId"
        }
    ])

    await db.removeEmployee(response.employeeId);
}

async function updateEmployeeRole() {
    var employees = await db.getEmployees();
    var roles = await db.getRoles();

    const response = await inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update?",
            choices: employees,
            name: "employeeId"
        },
        {
            type: "list",
            message: `What role would you like to assign the employee?`,
            choices: roles,
            name: "newRoleId"
        }
    ])

    await db.updateEmployeeRole(response.employeeId, response.newRoleId);
}

async function updateEmployeeManager() {
    var employees = await db.getEmployees();

    const response = await inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update?",
            choices: employees,
            name: "employeeId"
        },
        {
            type: "list",
            message: "Which manager would you like to assign the employee?",
            choices: employees,
            name: "newManagerId"
        }
    ])

    await db.updateEmployeeManager(response.employeeId, response.newManagerId);
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