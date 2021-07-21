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
        const sql = `
            SELECT
                employee.first_name,
                employee.last_name,
                role.title,
                department.name as department
            FROM
                employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id;`;

        this.connection.query(sql, (err, results) => {
            if (err) throw err;
            this.consoleTable(results);
        })
    }

    async getEmployees() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, first_name, last_name FROM employee;`;

            this.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }

                const employeeArray = [];

                results.forEach(employee => {
                    employeeArray.push({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    });
                });

                resolve(employeeArray);
            });
        });
    }

    async getManagers() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, first_name, last_name FROM employee WHERE id IN (
                    SELECT distinct manager_id FROM employee WHERE manager_id is not null
                );`;

            this.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }

                const nameArray = [];
    
                results.forEach(manager => {
                    nameArray.push({
                        name: `${manager.first_name} ${manager.last_name}`,
                        value: manager.id
                    });
                });

                resolve(nameArray);
            });
        });
    }

    viewEmployeesByManager(managerId) {
        const sql = `
            SELECT first_name, last_name
            FROM employee
            WHERE manager_id = ?`;

        const values = [ managerId ];

        this.connection.query(sql, values, (err, results) => {
            if (err) throw err;
            this.consoleTable(results)
        })
    }

    async addEmployee(firstName, lastName, roleId, managerId) {
        const sql = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;

        const values = [ firstName, lastName, roleId, managerId ]

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log(`${firstName} ${lastName} successfully added.`);
        });
    }

    removeEmployee(employeeId) {
        const sql = "DELETE FROM employee WHERE id = ?;"
        const values = [employeeId];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log("Employee has been removed.");
        });
    }

    async updateEmployeeRole(employeeId, roleId) {
        const sql = "UPDATE employee SET role_id = ? WHERE id = ?;"
        const values = [roleId, employeeId];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log("Employee's role has been updated.");
        });
    }

    async updateEmployeeManager(employeeId, newManagerId) {
        const sql = "UPDATE employee SET manager_id = ? WHERE id = ?;"
        const values = [newManagerId, employeeId];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log("Employee's manager has been updated.");
        });
    }

    viewEmployeesByDepartment(departmentId) {
        const sql = `
            SELECT employee.first_name, employee.last_name
            FROM
                employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
            WHERE department.id = ?;`;

        const values = [ departmentId ];

        this.connection.query(sql, values, (err, results) => {
            if (err) throw err;
            this.consoleTable(results)
        })
    }

    async getDepartments() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, name FROM department;";

            this.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }

                const nameArray = [];
    
                results.forEach(department => {
                    nameArray.push({
                        name: department.name,
                        value: department.id
                    });
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
        const sql = `INSERT INTO department (name) VALUES (?);`;
        const values = [ name ];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
        });
    }

    async getRoles() {
        return new Promise((resolve, reject) => {
          const sql = `SELECT id, title FROM role`;
      
          this.connection.query(sql, (err, results) => {
              if (err) {
                  reject(err);
              }
      
              const roleArray = [];
      
              results.forEach(role => {
                  roleArray.push({
                      name: role.title,
                      value: role.id
                  });
              });
      
              resolve(roleArray);
          });
      });
    }

    consoleTable(results) {
        console.log("\n\n");
        console.table(results);
    }
};

module.exports = EmployeeDatabase;