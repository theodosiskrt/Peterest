# Peterest
This is a CRUD application where you can create an account and upload posts/images of your pets! Since authorization is included, you have to be signed in to create a post. You have to be the author of a post in order to delete or edit it. 
Many features are going to be added in soon (Like system, pet names and more!).
This project was made using HTML, CSS, Javascript, Express and many other Javascript frameworks/Npm packages.
Detailed list of all frameworks and packages used in this project:
+ express
+ mongoose
+ joi
+ ejs
+ ejs-mate
+ method-override
+ morgan
+ flash
+ session
+ passport, passport-local, passport-local-mongoose
+ +all of their dependecies.

Instructions

+ 1.You need to have mongoDB installed on your machine.
  The following link has instruction on installing mongoDB on every Operating System: https://docs.mongodb.com/manual/installation/
+ 2.You need to start mongoDB.
+ 3.Open the "Peterest" folder on your console.
+ 4.Use the command "npm install" to install the required packages.
+ 4.5(optional) You can cd into the "seeds" folder and run "node seeds.js" so you can see some examples before you post anything.
+ 5.Use the command "node app.js" inside the "Peterest" folder and the application should be running on http://localhost:3000

+ Extra information: In order to login as the exampleUser (created in the seeds.js file) use these creditentials:
  Username: exampleUser
  Password: example
