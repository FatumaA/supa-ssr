import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";

export function createClient({
	request,
	cookies,
}: {
	request: Request;
	cookies: AstroCookies;
}) {
	return createServerClient(
		import.meta.env.SUPABASE_URL,
		import.meta.env.SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "");
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookies.set(name, value, options)
					);
				},
			},
		}
	);
}

// the above wont work with the latest supabase ssr and astro vertsions.
// you need to use the following code instead:
// import { createServerClient, parseCookieHeader } from "@supabase/ssr";
// import type { AstroCookies } from "astro";

// export function createBEClient({
// 	request,
// 	cookies,
// }: {
// 	request: Request;
// 	cookies: AstroCookies;
// }) {
// 	const cookieHeader = request.headers.get("Cookie") || "";

// 	return createServerClient(
// 		import.meta.env.SUPABASE_URL,
// 		import.meta.env.SUPABASE_ANON_KEY,
// 		{
// 			cookies: {
// 				getAll() {
// 					const cookies = parseCookieHeader(cookieHeader);
// 					return cookies.map(({ name, value }) => ({
// 						name,
// 						value: value ?? "",
// 					}));
// 				},
// 				setAll(cookiesToSet) {
// 					cookiesToSet.forEach(({ name, value, options }) =>
// 						cookies.set(name, value, options)
// 					);
// 				},
// 			},
// 		}
// 	);
// }
