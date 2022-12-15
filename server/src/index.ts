import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { UserResolver } from "./resolvers/UserResolver";


const main = async () => {
	const app = express();
	app.get("/", (_req, res) => {
		res.send("Hello world");
	});

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
		}),
		context: ({req, res}) => ({req, res})
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app, cors: {
			origin: ["https://studio.apollographql.com", "http://localhost:4000"],
			credentials: true
		}
	});
	app.listen(4000, () => {
		console.log(`Server started on port 4000`);
	});
};

main();
AppDataSource.initialize()
	.then(async () => {
	})
	.catch((err) => console.error(err));

