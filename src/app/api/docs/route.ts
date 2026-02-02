import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const specUrl = `${url.origin}/api/openapi`;

	const html = `<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>API Docs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
        <script>
        window.ui = SwaggerUIBundle({
            url: "${specUrl}",
            dom_id: "#swagger-ui",
            presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
            layout: "StandaloneLayout",
            // IMPORTANT:
            // This enables sending cookies if you are logged in to the app.
            requestInterceptor: (req) => {
                req.credentials = "include";
                return req;
            }
        });
        </script>
    </body>
</html>`;

	return new NextResponse(html, {
		status: 200,
		headers: { "content-type": "text/html; charset=utf-8" },
	});
}
