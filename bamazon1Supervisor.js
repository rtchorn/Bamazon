
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "your_password_here",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection Successful");
  makeTable();
});


function makeTable() {
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    promptSupervisor();
  });
}


function promptSupervisor() {
  inquirer.prompt([{
    type: "rawlist",
    name: "choice",
    message: "What would you like to do?",
    choices: ["View Product by Department", "Create New Department"]
  }]).then(function(val) {
    
if (val.choice === "View Product Sales by Department") {
      viewSales();
    }
    else if (val.choice === "Create New Department") {
      addDepartment();
    }
    else {
      
      console.log("Not a valid selection!");
      promptSupervisor();
    }
  });
}
function addDepartment() {
  inquirer.prompt([{
    type: "input",
    name: "name",
    message: "What is the name of the department?"
  }, {
    type: "input",
    name: "overhead",
    message: "What is the overhead cost of the department?"
  }]).then(function(val) {
    
    connection.query("INSERT INTO departments (department_name,over_head_costs,total_sales)" +
      " VALUES ('" + val.name + "'," + val.overhead + ",0.0);",
      function(err) {
        if (err) throw err;
        
        console.log("ADDED DEPARTMENT!");
        makeTable();
      });
  });
}

function viewSales() {
    connection.query("SELECT departments.department_id, departments.department_name," +
  " departments.over_head_costs, departments.total_sales," +
  " (departments.total_sales-departments.over_head_costs) AS total_profit FROM departments",
  function(err, res) {
    console.table(res);
  });
}