// import { decrypt } from "@/app/lib/session";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

export default function proxy() {
  return;
}

// const protectedRoutes = ["/dashboard", "/add", "/register-history", '/register-news];
// const publicRoutes = ["/"];

// export default async function proxy(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   // decrypt the session from the cookie
//   const cookie = (await cookies()).get("session")?.value;
//   const session = await decrypt(cookie);

//   // if it's protected route and no session => redirect to login page
//   if (isProtectedRoute && !session)
//     return NextResponse.redirect(new URL("/", req.nextUrl));

//   // if it's public, session has userId, and current path is not dashboard => redirect to dashboard
//   if (isPublicRoute && session?.userId && !path.startsWith("/dashboard"))
//     return NextResponse.redirect(new URL("/dashboard", req.nextUrl));

//   return NextResponse.next();
// }

// // Routes Proxy should not run on
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
// };
