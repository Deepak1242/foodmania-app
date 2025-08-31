# FoodMania - Food Delivery App

A full-stack food delivery application with React, Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for local development)
- Render account (for deployment)
- Stripe account (for payments)

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Deepak1242/foodmania-app.git
   cd food-delivery-app
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `backend` and `foodmania_frontend` directories
   - Update the environment variables with your configuration

3. **Start the application with Docker**
   ```bash
   docker-compose up --build
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

## Deployment to Render

### Prerequisites
- A Render account
- A PostgreSQL database (can be created during deployment)
- Stripe API keys

### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Blueprint"
   - Connect your GitHub repository
   - Select the repository and click "Apply"
   - Render will detect the `render.yaml` file and create the necessary services

3. **Configure Environment Variables**
   After the services are created, go to each service's settings and configure the environment variables:

   **Backend Service:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `FRONTEND_URL`: Your frontend URL (e.g., https://your-frontend-url.onrender.com)

   **Frontend Service:**
   - `VITE_API_URL`: Your backend API URL (e.g., https://your-backend-url.onrender.com)
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

4. **Deploy**
   - After configuring the environment variables, trigger a new deploy from the Render dashboard

## Database Migrations

Migrations are handled automatically during deployment. When you make changes to your Prisma schema:

1. Generate a migration:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

2. Push the changes to GitHub, and Render will apply the migrations during deployment.

## Environment Variables

### Backend
- `PORT`: Port to run the server on (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend
- `VITE_API_URL`: Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## Troubleshooting

### Prisma Generation Errors
If you encounter Prisma generation errors during deployment:

1. Check that the `DATABASE_URL` is correct and accessible
2. Ensure the database user has the necessary permissions
3. Verify that the Prisma schema is valid
4. Check the build logs in Render for specific error messages

### Common Issues
- **Prisma Client Not Generated**: Make sure `postinstall` script is set to `prisma generate` in package.json
- **Database Connection Issues**: Verify the database credentials and connection string
- **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in the backend environment variables

## License

MIT
