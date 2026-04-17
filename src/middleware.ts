import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/labadmin/login"

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/labadmin/login", req.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/labadmin/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/labadmin", "/labadmin/:path*"],
}
