DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
item_id INTEGER NOT NULL auto_increment,
product_name VARCHAR(55) NOT NULL,
department_name VARCHAR(55) NOT NULL,
price INTEGER DEFAULT 0,
stock_quantity INTEGER DEFAULT 0,
PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Jeans", "Clothes", 59.99, 20)
, ("Coding T-Shirt", "Clothes", 10.99, 10)
, ("Houston Astros Signed Baseball, Jose Altuve", "Sports Memorabilia", 199.99, 5)
, ("Pittsburgh Steelers Signed Jersey, TJ Watt", "Sports Memorabilia", 149.99, 3)
, ("Nintendo Switch", "Video Games", 299.99, 100)
, ("Mario Party 6", "Video Games", 59.99, 100)
, ("Jurassic World: Fallen Kingdom", "Movies & TV", 14.99, 20)
, ("Ant Man and the Wasp", "Movies & TV", 22.99, 20)
, ("Honey Nut Cheerios", "Pantry", 3.50, 40)
, ("JIF Peanut Butter", "Pantry", 2.49, 15)
 

