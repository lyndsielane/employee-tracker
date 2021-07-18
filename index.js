const inquirer = require('inquirer');
const EmployeeDatabase = require('./employeeDatabase');
const CFonts = require('cfonts');
let db;

function init() {
    db = new EmployeeDatabase();
}

const mainPrompt = [
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
            "Update employee manager"
        ],
        name: "choice"
    }
];

init();

db.createDepartment("Information Technology");