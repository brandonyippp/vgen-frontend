import { NextResponse } from "next/server";
import config from "./config";
import apiFetch from "./functions/apiFetch";
import getAuthHeaders from "./functions/getAuthHeaders";

//TODO: consider matcher
const authenticatedPaths = ["/", "/create", "/todos"];
const unauthenticatedPaths = ["/signup", "/signin"];

export async function middleware(req, event) {
  // Prevent users that aren't signed in from accessing certain protected pages
  if (authenticatedPaths.includes(req.nextUrl.pathname)) {
    try {
      let response = await apiFetch("/user/session", {
        headers: getAuthHeaders(req),
      });

      if (response.status !== 200) {
        throw "Unauthorized";
      }

      return NextResponse.next();
    } catch (err) {
      console.log(err);
      return NextResponse.redirect(`${config.FRONT_END_URL}/signin`);
    }
  } else if (req && unauthenticatedPaths.includes(req.nextUrl.pathname)) {
    //Behaviour to disable accessing /signup || /signin when already signed in
    try {
      let response = await apiFetch("/user/session", {
        headers: getAuthHeaders(req),
      });

      if (response.status === 200) {
        throw "Already signed in";
      }

      return NextResponse.next();
    } catch (err) {
      console.log(err);
      return NextResponse.redirect(`${config.FRONT_END_URL}/`);
    }
  } else {
    return NextResponse.next();
  }
}
