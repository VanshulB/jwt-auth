import "reflect-metadata";
import { User } from "../entity/User";
import { compare, hash } from "bcrypt";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../MyContext";
import { createAccessToken, createRefreshToken } from "../auth";
import { isAuth } from "../isAuth";


@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
}


@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return "hello world";
	}


	@Query(() => String)
	@UseMiddleware(isAuth)
	bye(@Ctx() {payload}: MyContext) {
		console.log(payload)
		return `your user id is ${payload!.userId}`;
	}


	@Query(() => User)
	async getUser(@Arg("id") id: number) {
		return await User.findOne({
			where: {
				id,
			},
		});
	}


	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() {res}: MyContext
	): Promise<LoginResponse> {
		const user = await User.findOne({where: {email}});
		if (!user) {
			throw new Error("User does not exist");
		}

		const valid = await compare(password, user.password);
		if (!valid) {
			throw new Error("Wrong Password");
		}

		res.cookie('jis', createRefreshToken(user), {httpOnly: true})

		// User successfully logged in.
		return {
			accessToken: createAccessToken(user)
		};
	}


	@Query(() => [User])
	async users() {
		return await User.find();
	}


	@Mutation(() => Boolean)
	async register(
		@Arg("email") email: string,
		@Arg("password") password: string
	) {
		try {
			const hashedPassword = await hash(password, 12);
			await User.insert({
				email,
				password: hashedPassword!,
			});
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
}
