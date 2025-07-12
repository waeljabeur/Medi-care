# Authentication Demo Mode

The application is now running in **Demo Mode** since Supabase credentials are not configured.

## How Demo Mode Works

- ✅ **No real backend required** - All authentication is simulated
- ✅ **Realistic UI/UX** - Same experience as production
- ✅ **Error handling** - Demonstrates error states
- ✅ **Session management** - Login/logout state preserved

## Demo Credentials

### Login Page (`/login`)

- **Any email/password works** (e.g., `demo@doctor.com` / `password123`)
- **Error testing**: Use `error@test.com` to see error handling

### Signup Page (`/signup`)

- **Any valid email format works**
- **Error testing**: Use `existing@test.com` to see "user already exists" error

### Forgot Password (`/forgot-password`)

- **Any email works** for reset simulation
- **Error testing**: Use `notfound@test.com` to see "email not found" error

## Production Setup

To use real Supabase authentication:

1. Create a `.env` file with:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

2. Restart the dev server

The app will automatically switch from demo mode to production mode.

## Features Tested

- [x] Login with email/password
- [x] Signup with name/email/password
- [x] Forgot password flow
- [x] Logout from dashboard
- [x] Error handling and validation
- [x] Session persistence
- [x] Responsive design
- [x] Medical theme styling
