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

    addEmployee() {
        const sql = `
            INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES ("${firstName}", "${lastName}" "${role}", "${manager}")`
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
};

module.exports = EmployeeDatabase;