const mysql = require('mysql2');

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
        });
    }

    getDepartments() {
        const sql = "SELECT department_name FROM department;";

        this.connection.query(sql, (err, results) => {
            if (err) throw err;
            this.consoleTable(results);
        });
    }

    createDepartment(department) {
        const sql = `INSERT INTO department_name (department) VALUES (?);`;
        const values = [ department ];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
        });
    }

    consoleTable(results) {
        console.log("\n\n");
        console.table(results);
    }
}

module.exports = EmployeeDatabase;