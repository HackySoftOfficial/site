export default function AdminLoginPage() {
  // Redirect to Cloudflare Access login
  if (typeof window !== 'undefined') {
    window.location.href = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_TEAM_NAME}.cloudflareaccess.com/cdn-cgi/access/login/${process.env.NEXT_PUBLIC_CLOUDFLARE_AUD_TAG}?redirect=${window.location.origin}/admin`;
  }
  
  return null;
}