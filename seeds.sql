USE employee_tracker;

INSERT INTO department (name) VALUES ("Management"), ("Staff");

set @managementDeptId = (SELECT id FROM department WHERE name = "Management");
set @staffDeptId = (SELECT id FROM department WHERE name = "Staff");

INSERT INTO role (title, salary, department_id) VALUES 
("Headmaster", 95000, @managementDeptId),
("Professor", 65000, @staffDeptId),
("Janitorial", 25000, @staffDeptId);

set @headmasterRoleId = (SELECT id FROM role WHERE title = "Headmaster");
set @professorRoleId = (SELECT id FROM role WHERE title = "Professor");
set @janitorialRoleId = (SELECT id FROM role WHERE title = "Janitorial");

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Albus", "Dumbledore", @headmasterRoleId);

set @headmasterEmployeeId = (SELECT id from employee where role_id = @headmasterRoleId);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Minerva", "Mcgonagall", @professorRoleId, @headmasterEmployeeId),
("Rubeus", "Hagrid", @janitorialRoleId, @headmasterEmployeeId),
("Severus", "Snape", @professorRoleId, @headmasterEmployeeId);
