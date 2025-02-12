\c business_db;

INSERT INTO department (name)
VALUES ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 80000, 001),
        ('Lead Engineer', 150000, 002),
        ('Software Engineer', 120000, 002),
        ('Account Manager', 160000, 003),
        ('Accountant', 125000, 003),
        ('Legal Team Lead', 250000, 004),
        ('Lawyer', 190000, 004);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mike', 'Chan', 1, null),
        ('Ashley', 'Rodriguez', 2, 1),
        ('Kevin', 'Tupik', 3, null),
        ('Kunal', 'Singh', 4, 3),
        ('Malia', 'Brown', 5, 3),
        ('Sarah', 'Lourd', 6, 1),
        ('Tom', 'Allen', 7, 1);
        