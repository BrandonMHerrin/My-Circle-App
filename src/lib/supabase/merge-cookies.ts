import { NextResponse } from "next/server";

export function mergeCookies(from: NextResponse, to: NextResponse) {
	from.cookies.getAll().forEach((c) => to.cookies.set(c));
	return to;
}
