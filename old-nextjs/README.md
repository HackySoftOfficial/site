# Next.js + Cloudflare Project

This is a modern web application built using Next.js and deployed on Cloudflare Pages. It includes features such as AI chat integration, an admin dashboard, and more.

## Features

- 🤖 AI Chat Interface integrated with GLHF.chat
- ⚡ Real-time streaming responses
- 🔐 Admin dashboard for managing settings
- 💾 Data storage using Cloudflare KV
- 🌐 Deployment on Cloudflare Pages
- 🎨 Aesthetic UI with shadcn/ui components

## Prerequisites

- Node.js version 18.x or higher
- A Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)
- GLHF.chat API key

## Environment Setup

1. Create a `.env.local` file with the necessary environment variables.

## Cloudflare KV Setup

1. **Install Wrangler CLI**: Ensure you have the Wrangler CLI installed (`npm install -g wrangler`).
2. **Login to Cloudflare**: Use `wrangler login` to authenticate your Cloudflare account.
3. **Create a KV Namespace**: Define a KV namespace in your `wrangler.toml` file. For example:
   ```toml
   [[kv_namespaces]]
   binding = "ORDERS_KV"
   id = "your-namespace-id"
   ```
4. **Deploy the Namespace**: Run `wrangler publish` to deploy your KV namespace.
5. **Access in Code**: Use the `ORDERS_KV` binding in your application to interact with the KV store.

## Database Setup

- **Orders Table**: Ensure your KV store includes an `orders` table with the following fields:
  - `id`: Unique identifier for each order.
  - `productId`: Identifier for the product associated with the order.
  - `amount`: The amount for the order.
  - `status`: Current status of the order (e.g., pending, completed, cancelled).
  - `coinbaseChargeId`: Optional field for Coinbase charge identification.
  - `contactMethod`: Method of contact for the order.
  - `contactValue`: Contact information for the order.
  - `transactionHash`: Transaction hash for completed orders.
  - `createdAt`: Timestamp when the order was created.
  - `updatedAt`: Timestamp when the order was last updated.

## Development Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the production bundle
- `npm run pages:build` - Build for Cloudflare Pages
- `npm run pages:deploy` - Deploy to Cloudflare Pages
- `npm run pages:watch` - Watch mode for Cloudflare Pages
- `npm run pages:dev` - Local development for Cloudflare Pages

## API Routes

### Chat API
- `POST /api/chat` - Send messages to the AI model
  - Supports streaming responses
  - Requires a GLHF API key

### Admin API
- `GET /api/admin/settings` - Retrieve site settings
- `POST /api/admin/settings` - Update site settings
  - Settings are stored in Cloudflare KV

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Support

For support, please email support@your-domain.com or open an issue in the repository.