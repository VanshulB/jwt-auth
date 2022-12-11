// import { AppDataSource } from "./data-source";
import express from "express";
// import { User } from "./entity/User";

const main = async () => {
  const app = express();
  app.get("/", (_req, res) => {
    res.send("Hello world");
  });
  app.listen(4000, () => {
    console.log(`Server started on port 4000`);
  });
};

main();

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
