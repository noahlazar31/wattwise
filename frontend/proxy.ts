import { NextRequest, NextResponse } from "next/server";

// Only enforce Clerk auth if keys are configured
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clerkProxy: any = null;
if (hasClerk) {
  const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server");
  const isProtectedRoute = createRouteMatcher(["/my-bills(.*)"]);
  clerkProxy = clerkMiddleware(async (auth: any, req: NextRequest) => {
    if (isProtectedRoute(req)) await auth.protect();
  });
}

export default function proxy(req: NextRequest) {
  if (clerkProxy) return clerkProxy(req);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
