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
            this.consoleTable(results);
        })
    }

    async getEmployees() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT first_name, last_name FROM employee;`;

            this.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }

                const employeeArray = [];

                results.forEach(employee => {
                    employeeArray.push(`${employee.first_name} ${employee.last_name}`);
                });

                resolve(employeeArray);
            });
        });
    }

    async getManagers() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT first_name, last_name FROM employee WHERE id IN (
                    SELECT distinct manager_id FROM employee WHERE manager_id is not null
                );`;

            this.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }

                const nameArray = [];
    
                results.forEach(manager => {
                    nameArray.push(`${manager.first_name} ${manager.last_name}`);
                });

                resolve(nameArray);
            });
        });
    }

    viewEmployeesByManager(name) {
        const nameParts = name.split(' ');

        const sql = `
            SELECT employees.first_name, employees.last_name
            FROM 
                employee employees
                JOIN employee managers ON employees.manager_id = managers.id
            WHERE managers.first_name = ? AND managers.last_name = ?;`;

        const values = nameParts;

        this.connection.query(sql, values, (err, results) => {
            if (err) throw err;
            this.consoleTable(results)
        })
    }

    async getEmployeeByName(name) {
        return new Promise((resolve, reject) => {
            const nameParts = name.split(' ');
            const sql = "SELECT * FROM employee WHERE first_name = ? AND last_name = ?;"
            const values = nameParts;

            this.connection.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                }

                resolve(result[0]);
            });
        });
    }

    async addEmployee(firstName, lastName, roleTitle, managerName) {
        var manager = await this.getEmployeeByName(managerName);
        var role = await this.getRoleByTitle(roleTitle);

        const sql = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;

        const values = [ firstName, lastName, role.id, manager.id ]

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log(`${firstName} ${lastName} successfully added.`);
        });
    }

    removeEmployee(employeeName) {
        const nameParts = employeeName.split(' ');
        const sql = "DELETE FROM employee WHERE first_name = ? AND last_name = ?;"
        const values = nameParts;

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log(`${employeeName} has been removed.`);
        });
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

    async getRoles() {
        return new Promise((resolve, reject) => {
          const sql = `SELECT title FROM role`;
      
          this.connection.query(sql, (err, results) => {
              if (err) {
                  reject(err);
              }
      
              const roleArray = [];
      
              results.forEach(role => {
                  roleArray.push(`${role.title}`);
              });
      
              resolve(roleArray);
          });
      });
    }

    async getRoleByTitle(title) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM role WHERE title = ?;";
            const values = [ title ];
        
            this.connection.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                }
        
                resolve(results[0]);
            });
        });
    }
};

module.exports = EmployeeDatabase;