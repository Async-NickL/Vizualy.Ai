import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]); // '/' is now public
const isRootRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is signed in and trying to access root route, redirect to /chat/new
  if (userId && isRootRoute(req)) {
    const chatUrl = new URL("/chat/new", req.url);
    return NextResponse.redirect(chatUrl);
  }

  // Protect non-public routes for unauthenticated users
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
