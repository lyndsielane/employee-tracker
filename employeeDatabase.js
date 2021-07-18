const mysql = require('mysql');

class EmployeeDatabase {
    connection;

    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'Root1234!',
            database: 'employee_tracker',
        });

        this.connection.connect((err) => {
            if (err) throw err;
            console.log(`connected as id ${this.connection.threadId}`);
            this.connection.end();
        });
    }

    createEmployee() {
        //insert new employee
    }

    createDepartment() {
        //create new department
    }

    createRole() {
        //create new role
    }
}

module.exports = EmployeeDatabase;