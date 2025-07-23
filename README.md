# Hacker News Clone

A full-stack Hacker News clone built with modern React and GraphQL technologies.

## Tech Stack

### Frontend

- **React 18.3+** - Latest React with concurrent features
- **Apollo Client 3.11+** - Modern GraphQL client with caching
- **React Router 6.30+** - Latest routing solution
- **graphql-ws** - Modern WebSocket transport for subscriptions

### Backend

- **Apollo Server 3.12+** - Modern GraphQL server
- **Prisma 5.22+** - Next-generation database toolkit
- **Express 4.21+** - Web framework
- **GraphQL Subscriptions** - Real-time updates
- **ES Modules** - Modern JavaScript modules

## Features

- ✅ User authentication (signup/login)
- ✅ Post links with descriptions
- ✅ Vote on links
- ✅ Real-time updates with GraphQL subscriptions
- ✅ Search functionality
- ✅ Pagination
- ✅ Modern React 18 patterns
- ✅ ES modules throughout

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd react-apollo-hackernews
   ```

2. **Install client dependencies**

   ```bash
   pnpm install
   ```

3. **Install server dependencies**

   ```bash
   cd server
   pnpm install
   ```

4. **Setup the database**

   ```bash
   cd server
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Running the Application

1. **Start the GraphQL server** (in `server/` directory):

   ```bash
   cd server
   pnpm run dev
   ```

   Server will be available at `http://localhost:4000`

2. **Start the React client** (in root directory):

   ```bash
   pnpm start
   ```

   Client will be available at `http://localhost:3000`

## Project Structure

```
├── public/                 # Static assets
├── src/                   # React application
│   ├── components/        # React components
│   ├── styles/           # CSS styles
│   └── index.js          # Application entry point
├── server/               # GraphQL server
│   ├── src/
│   │   ├── resolvers/    # GraphQL resolvers
│   │   ├── schema.graphql # GraphQL schema
│   │   ├── index.js      # Server entry point
│   │   └── utils.js      # Utility functions
│   └── prisma/           # Database schema and migrations
└── README.md            # This file
```

## Available Scripts

### Client

- `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests

### Server

- `pnpm run dev` - Start server in development mode
- `pnpm start` - Start server in production mode

## License

This project is licensed under the MIT License.
