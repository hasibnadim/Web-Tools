# 书 حكمة - Shū Hikma
## Book And Wisdom (BAW) - Web Tools Suite

A modern, open-source collection of developer and productivity tools built with Next.js, React, and shadcn/ui. BAW is designed to help you with everyday web, data, and code tasks, all in one place.

---

## ✨ Features

- **Random Key Generator**
  - Generate secure random keys for JWT, secrets, passwords, and more.
  - Customizable charset (special chars, upper/lowercase, digits).
  - Copy to clipboard.

- **Byte Converter**
  - Convert between bits, bytes, KB, MB, GB, TB, PB.
  - Simple, accurate, and fast.

- **JSON Size Calculator**
  - Paste any string, JSON, or JS object.
  - Instantly see character length, byte size, and (for JS objects) estimated RAM usage.
  - Minify JSON, generate TypeScript interfaces, and convert between JSON and JS object notation.

- **QR/Barcode Scanner**
  - Upload an image to extract QR/barcode data using ZXing.

- **Image to Morse Code**
  - Convert images to Morse code (and vice versa).

- **User Profiles & Authentication**
  - Google OAuth integration
  - Editable user personas with markdown support
  - Activity tracking and statistics
  - Secure session management

- **More tools coming soon!**

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB database (for user authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/hasibnadim/web-tools.git
cd web-tools

# Install dependencies
npm install
# or
yarn install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name

# Google OAuth (for authentication)
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Troubleshooting

### MongoDB TLS Module Error

If you encounter the error `Module not found: Can't resolve 'tls'`, this is a common issue with MongoDB in Next.js. The configuration has been updated to handle this, but if you still see the error:

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Restart the development server:**
   ```bash
   npm run dev
   ```

3. **Check your MongoDB connection string** - ensure it's properly formatted and accessible.

### Authentication Issues

- Ensure your Google OAuth client ID is correctly configured
- Check that your MongoDB connection string is valid
- Verify that the database and collections exist

---

## 🗂️ Project Structure

- `src/app/kit/` — Feature pages and components (random-key-generator, byte-converter, json-size-calculator, etc.)
- `src/components/ui/` — UI components (shadcn/ui based)
- `src/lib/` — Utility libraries and types (client-safe)
- `src/service/` — Backend services (auth, database) - **SERVER ONLY**
- `src/hooks/` — Custom React hooks (client-safe)
- `public/` — Static assets

### Architecture

This application follows a strict server/client separation:
- **Server-side**: MongoDB operations, authentication, data persistence
- **Client-side**: UI components, state management, user interactions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information.

---

## 🧑‍💻 Credits

- Developed and maintained by [Eng. Hasib Nadim](https://nd-resume.web.app)
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), and [ZXing](https://github.com/zxing-js/library)

---

## 📖 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🌏 Book And Wisdom

书, حكمة - Shū, Hikma — "Book and Wisdom" — a digital library and toolset for the modern web.
