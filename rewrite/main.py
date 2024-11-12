from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import httpx  # For async HTTP requests to Turnstile and Discord
import os

# Constants
DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1305531529472118855/EegPmCEEoOUsFIURZeNs4rLg4ZhCCq1Wa6NAlljhDJwN_GaXBB86VsLzFWynoZE70zsj'
TURNSTILE_SECRET_KEY = '0x4AAAAAAAz3lQ9_02B8nbSPg5OWpliP8xs'

# Initialize FastAPI app
app = FastAPI()

# Serve static files (e.g., favicon, CSS, JS, images)
current_dir = os.path.dirname(__file__)

# Serve main.html as root
@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_html(path: str = ""):
    if path == "":
        path = "main"
    if path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico')):
        try:
            file_path = os.path.join(current_dir, path)
            with open(file_path, "rb") as file:
                content = file.read()
            return Response(content=content, media_type=f"image/{path.split('.')[-1]}")
        except FileNotFoundError:
            return Response(content="File not found", status_code=404)
    if not path.endswith(".html"):
        path += ".html"
    try:
        html_file_path = os.path.join(current_dir, path)
        with open(html_file_path, "r") as file:
            html_content = file.read()
        return HTMLResponse(content=html_content, status_code=200)
    except FileNotFoundError:
        return HTMLResponse(content="Page not found", status_code=404)

# Contact form POST endpoint
@app.post("/contact")
async def contact_form(request: Request):
    try:
        data = await request.json()

        # Validate required fields
        if not all(field in data and data[field] for field in ["name", "email", "message", "turnstileToken"]):
            return JSONResponse({"error": "All fields are required"}, status_code=400)

        # Skip Turnstile verification for localhost
        client_host = request.client.host
        if client_host != "127.0.0.1":
            # Verify Cloudflare Turnstile token
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
                    return JSONResponse(
                        {"error": "Security verification failed. Please try again."},
                        status_code=403
                    )

        # Send to Discord webhook
        discord_payload = {
            "embeds": [{
                "title": "❓ New Support Email Received",
                "color": 0x00ff00,
                "fields": [
                    {"name": "Name", "value": data["name"], "inline": True},
                    {"name": "Email", "value": data["email"], "inline": True},
                    {"name": "Message", "value": data["message"], "inline": False}
                ],
                "timestamp": data.get("timestamp", ""),
            }]
        }
        
        async with httpx.AsyncClient() as client:
            discord_response = await client.post(
                DISCORD_WEBHOOK_URL,
                json=discord_payload,
                headers={'Content-Type': 'application/json'}
            )
            if discord_response.status_code != 204:
                raise HTTPException(status_code=500, detail="Failed to send to Discord webhook")

        return JSONResponse({"success": True})
    
    except Exception as e:
        print("Contact form error:", e)
        return JSONResponse(
            {"error": "Failed to send message"},
            status_code=500
        )

# Code to run the server when executing the Python file directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
