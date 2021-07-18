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

    getDepartments() {
        const sql = "SELECT name FROM department;";

        this.db.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
        });
    }

    createDepartment(name) {
        const sql = `INSERT INTO department (name) VALUES (?);`;
        const values = [ name ];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
        });
    }
}

module.exports = EmployeeDatabase;