const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

connection.connect(function(err){
    if(err) throw err;
    console.log("SQL Connected");
    start();
});

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "start",
                message: "What would you like to do?",
                choices: ["View", "Create", "Update", "Exit"]
            }
        ]).then(function(res){
            switch(res.start){
                case "View":
                    view();
                    break;
                case "Create":
                    create();
                    break;
                case "Update":
                    update();
                    break;
                case "Exit":
                    console.log("You are all done")
                    break;
                default:
                    console.log("dafault");
            }
        });
};
function view() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "view",
                message: "Select one to view",
                choices: ["All Employees", "Employees By Role", "Employees By Department"]
            }
        ]).then(function(res){
            switch(res.view){
                case "All Employees":
                    viewAllEmployees();
                    break;
                case "Employees By Role":
                    viewByRole();
                    break;
                case "Employees By Department":
                    viewByDepartment();
                    break;
                default:
                    console.log("default");
            }
        });
};

function viewAllEmployees() {
    connection.query("select * from employees inner join roles on employees.role_id = roles.id inner join departments on roles.department_id = departments.id", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    });
}

function viewByRole() {
    connection.query("select * from roles", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    name: "choice",
                    choices: function(){
                        let choiceArray = [];
                        for(i=0; i< results.length; i++){
                            choiceArray.push({
                                value: results[i].id,
                                name: results[i].title   
                            });
                        }
                        return choiceArray;
                    },
                    message: "Select which Role you want to view."
                }
            ]).then(function(answer){
                connection.query("select * from employees inner join roles on employees.role_id = roles.id inner join departments on roles.department_id = departments.id where roles.title = ?", [answer.choice], function (err, results){
                    if (err) throw err;
                    console.table(results);
                    start();
                });
            })
    })
}

function viewByDepartment() {
    connection.query("select * from departments", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    name: "choice",
                    choices() {
                        let choiceArray = [];
                    for(i=0; i< results.length; i++){
                        choiceArray.push(results[i].name);
                    }
                    return choiceArray;
                },
                message: "Select which Department you want to view."
                }
            ]).then(function(answer){
                connection.query("select * from employees inner join roles on employees.role_id = roles.id inner join departments on roles.department_id = departments.id where departments.name = ?", [answer.choice], function (err, results){
                    if (err) throw err;
                    console.table(results);
                    start();
                });
            })
    })
}

function create() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "create",
                message: "What would you like to add?",
                choices: ["Employee", "Role", "Department"]
            }
        ]).then(function(res){
            switch(res.create){
                case "Employee":
                    addEmployee();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Department":
                    addDepartment();
                    break;
                default:
                    console.log("default");
            }
        })
}

function addDepartment(){
    inquirer
    .prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the Department?"
        }
    ]).then(function(answer){
        connection.query("insert into departments values (default, ?)", [answer.department], function(err) {
            if (err) throw err;
            console.log("Departments updated with " + answer.department);
            start();
        })
    });
}

function addRole(){
    inquirer
        .prompt([
            {
                type: "input",
                name: "role",
                message: "What is the name of the Role?"
            },
            {
                type: "number",
                name: "salary",
                message: "Enter the Salary",
                validate: function(value){
                    if(isNaN(value)===false){
                        return true;
                    }
                    return false;
                }
            },
            {
                type: "number",
                name: "department_id",
                message: "Enter Department Id",
                validate: function(value){
                    if(isNaN(value)===false){
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer){
            connection.query("insert into roles set ?",{
                title: answer.role,
                salary: answer.salary,
                department_id: answer.department_id
            }, 
            function(err){
                if (err) throw err;
                console.log("Roles updated with " + answer.role + ' ' + answer.salary +' and ' + answer.department_id + ".");
                start();
            })
        });
}

function addEmployee(){
    connection.query("select * from roles", function(err, results) {
        if (err) throw err;
    inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "Enter the employee's First Name."
            },
            {
                type: "input",
                name: "last_name",
                message: "Enter the employee's Last Name."
            },
            {
                type: "rawlist",
                name: "role",
                choices: function(){
                    let choiceArray = [];
                    for(i=0; i<results.length; i++){
                        choiceArray.push({
                            value: results[i].id,
                            name: results[i].title   
                        })
                    }
                    return choiceArray;
                },
                message: "Select Role"
            },
            {
                type: "number",
                name: "manager",
                validate: function(value){
                    if (isNaN(value)===false){
                        return true;
                    }
                    return false;
                },
                message: "Enter Manager Id.",
                default: "1"
            }
        ]).then(function(answer){
            console.log(answer);
            connection.query("insert into employees set ?", {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role,
                manager_id: answer.manager
            })
            console.log("Employee added");
            start();
        });
    });
}

function update(){
    inquirer
        .prompt([
            {
                type: "list",
                name: "update",
                message: "What would you like to update?",
                choices: ["Employee", "Department", "Role"]
            }
        ]).then(function(res){
            switch(res.update){
                case "Employee":
                    updateEmployee();
                    break;
                case "Role":
                    updateRole();
                    break;
                case "Department":
                    updateDepartment();
                    break;
                default:
                    console.log("default");
            }
        })
}

function updateEmployee(){
    connection.query("select * from employees", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    name: "choice",
                    choices: function(){
                        choiceArray = [];
                        for(i=0; i< results.length; i++){
                            choiceArray.push(results[i].last_name);
                        }
                        return choiceArray;
                    },
                    message: "Select the Last Name of the employee to update."
                },
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter the employee's First Name."
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter the employee's Last Name."
                },
                {
                    type: "rawlist",
                    name: "role",
                    choices: function(){
                        let choiceArray = [];
                        for(i=0; i<results.length; i++){
                            choiceArray.push({
                                value: results[i].id,
                                name: results[i].title   
                            })
                        }
                        return choiceArray;
                    },
                    message: "Select Role"
                },
                {
                    type: "number",
                    name: "manager",
                    validate: function(value){
                        if (isNaN(value)===false){
                            return true;
                        }
                        return false;
                    },
                    message: "Enter Manager Id.",
                    default: "1"
                }
            ]).then(function(answer){
                const updatedName = answer.choice;
                connection.query("update employees set ? where last_name = ?", 
                            [
                                {
                                    first_name: answer.first_name,
                                    last_name: answer.last_name,
                                    role: answer.role,
                                    manager: answer.manager
                                }, updatedName
                            ],)
                }),
                console.log("Updated Employee");
                start();
    });
}




function updateRole(){
    connection.query("select * from roles", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    name: "choice",
                    choices: function(){
                        choiceArray = [];
                        for(i=0; i< results.length; i++){
                            choiceArray.push({
                                    value: results[i].id,
                                    name: results[i].title
                                });
                        }
                    },
                    message: "Select the Role to update."
                }
            ]).then(function(answer){
                const updatedRole = answer.choice;
                connection.query("update roles set ? where id = ?", [{
                    role_id: answer.id,
                    title: answer.title
                }, updatedRole
            ]),
                console.log("Role Updated");
                start();
            })
    })
}

function updateDepartment(){
    connection.query("select * from departments", function(err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    name: "choice",
                    choices: function(){
                        let choiceArray = [];
                        for(i=0; i<results.length; i++){
                            choiceArray.push({
                                value: results[i].id,
                                name: results[i].department
                            });
                        }
                    },
                    message: "Select the Department to update."
                }
            ]).then(function(answer){
                connection.query("update departments set ? where id = ?", [{
                    department_id: answer.id,
                }])
            })
    })
}
