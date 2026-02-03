import { NextRequest, NextResponse } from "next/server";
import { buildOpenApiSpec } from "@/lib/openapi";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const baseUrl = `${url.protocol}//${url.host}`;
	return NextResponse.json(buildOpenApiSpec(baseUrl));
}
