import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { UserResolver } from "./resolvers/UserResolver";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken } from "./auth";


const main = async () => {
	const app = express();
	app.use(cookieParser())
	app.get("/", (_req, res) => {
		res.send("Hello world");
	});

	app.post("/refresh_token", async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ok: false, accessToken: ""});
		}
		let payload: any = null;
		try {
			payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
		} catch (err) {
			console.error(err);
			res.send({ok: false, accessToken: ""});
		}

		const user = await User.findOne({where: {id: payload!.userId}});
		if (!user) {
			return res.send({ok: false, accessToken: ""});
		} else {
			return res.send({ok: true, accessToken: createAccessToken(user)})
		}
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

main().then();
AppDataSource.initialize()
	.then(async () => {
	})
	.catch((err) => console.error(err));

