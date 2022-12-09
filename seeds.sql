use employee_db;

delete from departments;

insert into departments
    (name)
values
    ("Bridge Crew"),
    ("Security"),
    ("Medical"),
    ("Engineering");

insert into roles
    (title, salary, department_id)
values
    ("Captain", 3000000, 1),
    ("Commander Bridge", 225000, 1),
    ("Commander Engineering", 225000, 4),
    ("Lieutenant", 200000, 2),
    ("Doctor", 275000, 3),
    ("Ensign Engineering", 65000, 4),
    ("Ensign Medical", 65000, 3),
    ("Ensign Bridge", 65000, 1);

-- employee table

insert into employees
    (first_name, last_name, role_id, manager_id)
values
    ("Carol", "Freeman", 1, null),
    ("Jack", "Ransom", 2, 1),
    (null, "Shaxs", 4, 2),
    (null, "T'Ana", 5, 2),
    ("D'Vana", "Tendi", 7, 4),
    ("Beckett", "Mariner", 8, 2),
    ("Brad", "Boimler", 8, 2),
    ("Andy", "Billups", 3, 1),
    ("Sam", "Rutherford", 6, 8);


