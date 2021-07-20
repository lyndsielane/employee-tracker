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
        });
    }

    viewEmployees() {
        const sql = "SELECT first_name, last_name FROM employee;";

        this.connection.query(sql, (err, results) => {
            if (err) throw err;
            this.consoleTable(results)
        })
    }

    viewEmployeesByDepartment(name) {
        const sql = `
            SELECT employee.first_name, employee.last_name
            FROM
                employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
            WHERE department.name = ?;`;

        const values = [ name ];

        this.connection.query(sql, values, (err, results) => {
            if (err) throw err;
            this.consoleTable(results)
        })
    }

    async getDepartments() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT name FROM department;";

            this.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }

                const nameArray = [];
    
                results.forEach(department => {
                    nameArray.push(department.name);
                });

                resolve(nameArray);
            });
        });
    }

    viewDepartments() {
        const sql = "SELECT name FROM department;";

        this.connection.query(sql, (err, results) => {
            if (err) throw err;
            this.consoleTable(results);
        });
    }

    createDepartment(name) {
        const sql = `INSERT INTO name (department) VALUES (?);`;
        const values = [ name ];

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