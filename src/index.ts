/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

interface TurnstileResponse {
	success: boolean;
}

interface ContactFormData {
	name: string;
	email: string;
	message: string;
	turnstileToken: string;
}

export default {
	async fetch(request: Request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const method = request.method;
		const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1305531529472118855/EegPmCEEoOUsFIURZeNs4rLg4ZhCCq1Wa6NAlljhDJwN_GaXBB86VsLzFWynoZE70zsj';
		const TURNSTILE_SECRET_KEY = '0x4AAAAAAAz3lQ9_02B8nbSPg5OWpliP8xs';

		if (method === 'POST' && url.pathname === '/contactus') {
			try {
				const data = await request.json() as ContactFormData;

				// Validate required fields
				const requiredFields = ["name", "email", "message", "turnstileToken"] as const;
				if (!requiredFields.every(field => data[field])) {
					return new Response(JSON.stringify({ error: "All fields are required" }), {
						status: 400,
						headers: { 'Content-Type': 'application/json' }
					});
				}

				// Skip Turnstile verification for localhost or 127.0.0.1
				const origin = request.headers.get('origin') || '';
				if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
					// Verify Cloudflare Turnstile token
					const formData = new URLSearchParams();
					formData.append('secret', TURNSTILE_SECRET_KEY);
					formData.append('response', data.turnstileToken);

					const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: formData
					});

					const turnstileData = await turnstileResponse.json() as TurnstileResponse;
					if (!turnstileData.success) {
						return new Response(JSON.stringify({ 
							error: `Security verification failed. Please try again. Data: ${JSON.stringify(turnstileData)}`
						}), {
							status: 403,
							headers: { 'Content-Type': 'application/json' }
						});
					}
				}

				// Send to Discord webhook
				const discordPayload = {
					embeds: [{
						title: "❓ New Support Email Received",
						color: 0x00ff00,
						fields: [
							{ name: "Name", value: data.name, inline: true },
							{ name: "Email", value: data.email, inline: true },
							{ name: "Message", value: data.message, inline: false }
						],
						timestamp: new Date().toISOString(),
					}]
				};

				const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(discordPayload)
				});

				if (discordResponse.status !== 204) {
					throw new Error('Failed to send to Discord webhook');
				}

				return new Response(JSON.stringify({ success: true }), {
					headers: { 'Content-Type': 'application/json' }
				});

			} catch (e) {
				console.error("Contact form error:", e);
				return new Response(JSON.stringify({ error: "Failed to send message" }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
