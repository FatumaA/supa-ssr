import { defineAction, type ActionAPIContext } from "astro:actions";
import { z } from "astro:schema";
import { createClient } from "../lib/supabase";

const emailSignUp = async (
	{
		email,
	}: {
		email: string;
	},
	context: ActionAPIContext
) => {
	console.log("Sign up action");
	try {
		const supabase = createClient({
			request: context.request,
			cookies: context.cookies,
		});

		console.log("Request cookies:", context.request.headers.get("Cookie"));

		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: "http://localhost:4321/api/exchange",
			},
		});

		if (error) {
			console.error("Sign up error", error);
			return {
				success: false,
				message: error.message,
			};
		} else {
			console.log("Sign up success", data);
			return {
				success: true,
				message: "Successfully logged in",
			};
		}
	} catch (err) {
		console.error("SignUp action other error", err);
		return {
			success: false,
			message: "Unexpected error",
		};
	}
};

export const server = {
	signIn: defineAction({
		accept: "form",
		input: z.object({
			email: z.string().email(),
		}),
		handler: async (input, context) => {
			return emailSignUp(input, context);
		},
	}),
	signOut: defineAction({
		handler: async (_, context) => {
			const supabase = createClient({
				request: context.request,
				cookies: context.cookies,
			});
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Sign out error", error);
				return {
					success: false,
					message: error.message,
				};
			}
			return {
				success: true,
				message: "Successfully signed out",
			};
		},
	}),
};
