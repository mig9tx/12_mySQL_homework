//Application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

//App should then prompt users with two messages.
//as them the id of the product they would like to buy. CHECK
//ask how many units of the product they would like to buy. CHECK

//application should then check if your store has enough of the product to meet the customer's request. CHECK
//if not thenn the app should log Insufficient Quantity!, and then prevent the order from going through. CHECK

//If store has enough the the order should be fulfilled. CHECK
//update database to reflect remaining qty. CHECK
//once order goes through, display the total cost to the customer. 


const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require('chalk');
const clear = require('clear');
const cTable = require('console.table');

//create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db",
});
//connect to the mysql server and sql database
connection.connect(function (err, res) {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    // console.log(res);

    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // clear();
        console.log("\n");
        console.table(res);
        promptCustomer();
        // connection.end();
    })
};

function promptCustomer() {
    inquirer
        .prompt([{
                name: "item_id",
                type: "input",
                message: chalk.yellow.bold("What is the Id of the item you want to buy?"),
            },
            {
                name: "quantity",
                type: "input",
                message: chalk.yellow.bold("How many would you like to buy?")
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE ?", {
                item_id: answer.item_id
            }, function (err, res) {
                if (err) throw err;
                // console.log(res);
                // console.log(res[0].product_name);
                if (parseInt(answer.quantity) < parseInt(res[0].stock_quantity)) {
                    var updatedQuantity = parseInt(res[0].stock_quantity) - parseInt(answer.quantity);
                    var price = parseInt(answer.quantity) * parseInt(res[0].price);
                    console.log(chalk.blue("\n-----------------------")) + 
                    console.log(chalk.green.bold("Your Total is: $" + price));
                    console.log(chalk.blue("-----------------------"));
                    console.log(chalk.green.bold("Thank You For Your Purchase!"))
                    // console.log(updatedQuantity);
                    updateQuantity(updatedQuantity, answer.item_id);
                }
                else if (parseInt(answer.quantity) > parseInt(res[0].stock_quantity)) {
                    console.log(chalk.red.bold("\nInsufficient Quantity! Please change amount."));
                    setTimeout(start, 2000);
                    // start();
                }
            })
        })

}

function updateQuantity(quantity, item_id) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: quantity
            },
            {
                item_id: item_id //could just use item_id by itself since they are both the same
            }
        ],
        function (error) {
            if (error) throw err;
            // console.log("\n Updated quantity");
            setTimeout(start, 2000);
            // start();
        }
    );
}