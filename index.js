const inquirer = require('inquirer');
const EmployeeDatabase = require('./employeeDatabase');
let db;

function init() {
    db = new EmployeeDatabase();
}

init();