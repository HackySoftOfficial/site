from cloudflare_worker import Worker, Request, Response
import httpx
import os
import re
import codecs

# Constants
DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1305531529472118855/EegPmCEEoOUsFIURZeNs4rLg4ZhCCq1Wa6NAlljhDJwN_GaXBB86VsLzFWynoZE70zsj'
TURNSTILE_SECRET_KEY = '0x4AAAAAAAz3lQ9_02B8nbSPg5OWpliP8xs'

# Google Analytics snippet
GOOGLE_ANALYTICS = '''<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DNJN1PF3CS"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-4JS04XN1KX');
</script>
'''

worker = Worker()

@worker.route("/", methods=["GET"])
@worker.route("/<path>", methods=["GET"])
async def serve_html(request: Request, path: str = "") -> Response:
    """Serve static HTML files and inject Google Analytics."""
    if path == "":
        path = "main"
    if not path.endswith(".html"):
        path += ".html"
    
    try:
        # Read the HTML file
        file_path = os.path.join("./static", path)
        with codecs.open(file_path, "r", encoding="utf-8") as f:
            html_content = f.read()
        
        # Inject Google Analytics code
        if '<head>' in html_content:
            html_content = html_content.replace('<head>', f'<head>\n{GOOGLE_ANALYTICS}')
        else:
            html_content = f'<head>\n{GOOGLE_ANALYTICS}</head>\n{html_content}'
        
        return Response(body=html_content, content_type="text/html; charset=utf-8")
    except FileNotFoundError:
        return Response("Page not found", status=404)

@worker.route("/contact", methods=["POST"])
async def contact_form(request: Request) -> Response:
    """Handle contact form submissions."""
    try:
        data = await request.json()

        # Validate required fields
        required_fields = ["name", "email", "message", "turnstileToken"]
        if not all(field in data and data[field] for field in required_fields):
            return Response(body='{"error": "All fields are required"}', content_type="application/json", status=400)

        # Verify Turnstile token
        async with httpx.AsyncClient() as client:
            turnstile_response = await client.post(
                'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                data={
                    'secret': TURNSTILE_SECRET_KEY,
                    'response': data["turnstileToken"],
                }
            )
            turnstile_data = turnstile_response.json()
            if not turnstile_data.get("success"):
                return Response(
                    body='{"error": "Security verification failed. Please try again."}',
                    content_type="application/json",
                    status=403
                )

        # Send to Discord webhook
        discord_payload = {
            "embeds": [{
                "title": "📧 New Support Email Received",
                "color": 0x00ff00,
                "fields": [
                    {"name": "Name", "value": data["name"], "inline": True},
                    {"name": "Email", "value": data["email"], "inline": True},
                    {"name": "Message", "value": data["message"], "inline": False}
                ]
            }]
        }
        
        async with httpx.AsyncClient() as client:
            discord_response = await client.post(
                DISCORD_WEBHOOK_URL,
                json=discord_payload,
                headers={'Content-Type': 'application/json'}
            )
            if discord_response.status_code != 204:
                return Response(body='{"error": "Failed to send to Discord webhook"}', content_type="application/json", status=500)

        return Response(body='{"success": true}', content_type="application/json")
    
    except Exception as e:
        return Response(
            body=f'{{"error": "An unexpected error occurred: {str(e)}"}}',
            content_type="application/json",
            status=500
        )

@worker.route("/static/<path>", methods=["GET"])
async def serve_static(request: Request, path: str) -> Response:
    """Serve static files such as images or CSS."""
    try:
        file_path = os.path.join("./static", path)
        with open(file_path, "rb") as f:
            content = f.read()
        
        # Infer MIME type from file extension
        mime_type = "application/octet-stream"
        if path.endswith(".png"):
            mime_type = "image/png"
        elif path.endswith(".jpg") or path.endswith(".jpeg"):
            mime_type = "image/jpeg"
        elif path.endswith(".svg"):
            mime_type = "image/svg+xml"
        elif path.endswith(".css"):
            mime_type = "text/css"
        
        return Response(body=content, content_type=mime_type)
    except FileNotFoundError:
        return Response("File not found", status=404)

# Entry point for the Cloudflare Worker
if __name__ == "__main__":
    worker.run()
