// Challenge #2: Manager View (Next Level)
// Create a new Node application called bamazonManager.js. Running this application will:

// List a set of menu options:

// View Products for Sale

// View Low Inventory

// Add to Inventory

// Add New Product

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require('chalk');
const cTable = require('console.table');
const clear = require('clear');

//create the connection information for the sql database
const connection = mysql.createConnection({
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
    clear();
    promptManager();
});

function promptManager() {
    console.log("\n");
    // clear();
    inquirer
        .prompt([{
            name: "items",
            type: "list",
            message: "Please select an option from below:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }])
        .then(function (answer) {
            console.log(answer);
            if (answer.items === "View Products for Sale") {
                viewProducts();
            };
            if (answer.items === "View Low Inventory") {
                console.log(answer);
                viewLowInventory();
            };
            if (answer.items === "Add to Inventory") {
                addInventory();
            };
            if (answer.items === "Add New Product") {
                addNewProduct();
            };

        });
}

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        // clear();
        if (err) throw err;
        console.log("\n");
        console.table(res);
    });
};

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        clear();
        // console.log("\n");
        console.log(chalk.bold.green("--------------"));
        console.log(chalk.bold.green("ITEMS FOR SALE"));
        console.log(chalk.bold.green("--------------"));
        console.table(res);
        promptManager();
    });
};

function viewLowInventory() {
    clear();
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log(chalk.green.bold("-------------------"));
        console.log(chalk.green.bold("LOW INVENTORY ITEMS"));
        console.log(chalk.green.bold("-------------------"));
        console.log("\n");
        console.table(res);
        promptManager();
    });
};

function addInventory() {
    clear();
    console.log(chalk.green("-----------------------------------"));
    console.log(chalk.green("ADD INVENTORY TO ITEMS THAT ARE LOW"));
    console.log(chalk.green("-----------------------------------"));
    connection.query("SELECT * FROM products", function (err, res) {
        // clear();
        if (err) throw err;
        console.log("\n");
        console.table(res);
        inquirer
            .prompt([{
                    name: "item_id",
                    type: "input",
                    message: "What is the product id of the item to add inventory?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    },
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "What quantity would you like to add to this item?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    },
                }
            ])

            .then(function (answer) {
                connection.query("SELECT * FROM products WHERE ?", {
                    item_id: answer.item_id
                }, function (err, res) {
                    if (err) throw err;
                    // console.log(res);

                    // console.log(answer);
                    var quantity = parseInt(res[0].stock_quantity);
                    // console.log(answer.stock_quantity);

                    var new_quantity = parseInt(answer.stock_quantity) + quantity;
                    // console.log(chalk.red(new_quantity));
                    // when finished prompting, insert a new item into the db with that info
                    updateInventory(new_quantity, answer.item_id);
                });

            });
    });
};

function updateInventory(new_quantity, item_id) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: new_quantity
            },
            {
                item_id: item_id
            }
        ],
        function (error) {
            if (error) throw err;
            // console.log(query);
            clear();
            connection.query("SELECT * FROM products", function (err, res) {
                // clear();
                if (err) throw err;
                console.log("\n");
                console.table(res);
                console.log(chalk.green("Item Quantity Updated Succesfully!"));
                promptManager();
            });
        }
    );
}

function addNewProduct() {
    clear();
    console.log("ADD NEW ITEM TO STORE");
    inquirer
        .prompt([{
                name: "product_name",
                type: "input",
                message: "What is the name of the product to add?"
            },
            {
                name: "department_name",
                type: "input",
                message: "What is the department category of the product to add?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the product to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "What is the quantity of the product to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your procuct was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    promptManager();
                }
            );
        });
};