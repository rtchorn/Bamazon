var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection Successful!");
  makeTable();
});


function makeTable() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.table(res);
    promptCustomer(res);
  });
}


function promptCustomer(res) {
  inquirer.prompt([{
    type: "input",
    name: "choice",
    message: "What is the name of the product you would like to purchase? Quit with Q"
  }]).then(function(answer) {
    
    var correct = false;
    
    if (answer.choice.toUpperCase() === "Q") {
      process.exit();
    }
    
    for (var i = 0; i < res.length; i++) {
        if (res[i].item_id === parseInt(answer.choice)) {
       
        correct = true;
        askHowMany(res[i], answer);
        
        break;
      }
    }
   
    if (!correct) {
      console.log("Not valid");
      promptCustomer(res);
    }
  });
}
function askHowMany(product, productList) {
  inquirer.prompt({
    type: "input",
    name: "quant",
    message: "How many would you like to buy?"
  }).then(function(answer) {
    
    if ((product.stock_quantity - answer.quant) > 0) {
      connection.query("UPDATE products SET stock_quantity='" +
        (product.stock_quantity - answer.quant) + "', product_sales='" +
        (product.product_sales + answer.quant * product.price) +
        "' WHERE item_id='" + product.item_id + "'",
function() {
connection.query("UPDATE departments SET total_sales=total_sales+'" +
            (answer.quant * product.price) +
            "' WHERE department_name='" +
            product.department_name + "';",
            function() {
              console.log("SALES ADDED!");
            });
          console.log("Product Bought!");
          
          makeTable();
        });
    }
    else {
   
      console.log("Not a valid selection!");
      promptCustomer(productList);
    }
  });
}