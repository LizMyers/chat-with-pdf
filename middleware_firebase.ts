// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { signInWithCustomToken } from 'firebase/auth';
import { auth as firebaseAuth } from './firebase';


const isProtectedRoute = createRouteMatcher(["/dashboard(x*)"]);

const customMiddleware = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        auth().protect();

        // Get the Clerk token
        const token = await auth().getToken({ template: "firebase" });

        if (token) {
            // Sign in to Firebase with the custom token
            try {
                await signInWithCustomToken(firebaseAuth, token);
            } catch (error) {
                console.error("Error signing in with custom token: ", error);
                return NextResponse.redirect("/sign-in");
            }
        } else {
            return NextResponse.redirect("/sign-in");
        }
    }

    return NextResponse.next();
});

export default customMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};