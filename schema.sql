DROP database if exists employee_db;

CREATE database employee_db;

USE employee_db;

CREATE table departments(
    id int auto_increment not null,
    name varchar(30) not null,
    primary key(id)
);

CREATE table roles(
    id int auto_increment not null,
    title varchar(30) not null,
    salary decimal,
    department_id int not null,
    primary key(id),
    foreign key(department_id) 
        references departments(id)
        on delete cascade
        on update cascade
);

CREATE table employees(
    id int auto_increment not null,
    first_name varchar(30),
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    foreign key(employee_id)
        references employees(id)
        on update cascade
    primary key(id),
    foreign key(role_id) 
        references roles(id)
        on delete cascade
        on update cascade
);
