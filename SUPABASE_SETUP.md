# Supabase Setup Guide for Doctor Dashboard

## ✅ Step 1: Credentials (COMPLETED)

You already have your `.env.local` file with Supabase credentials set up correctly.

## 🔧 Step 2: Database Setup

### 2.1 Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `ywkcdnczxqbqmpvfghdr`

### 2.2 Run Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `database-setup.sql`
4. Click **"RUN"** to execute the script

This will create:

- ✅ `doctors` table - stores doctor profiles
- ✅ `patients` table - stores patient information
- ✅ `appointments` table - stores appointment data
- ✅ Row Level Security (RLS) policies - ensures data privacy
- ✅ Automatic triggers - creates doctor profile on signup

## 🔐 Step 3: Authentication Setup

### 3.1 Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Make sure **Email** is enabled
3. Set **Email confirm** to your preference (recommended: enabled for production)

### 3.2 Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize signup confirmation and password reset emails

## 🗃️ Step 4: Verify Database Structure

### 4.1 Check Tables

In **Table Editor**, you should see:

- `doctors` - with columns: id, name, email, created_at
- `patients` - with columns: id, doctor_id, name, dob, phone, email, medical_history, created_at
- `appointments` - with columns: id, doctor_id, patient_id, date, time, reason, notes, status, created_at

### 4.2 Check RLS Policies

In **Authentication** → **Policies**, verify policies exist for all tables.

## 🧪 Step 5: Test the Application

### 5.1 Restart Development Server

```bash
npm run dev
```

### 5.2 Test Signup Flow

1. Go to `/signup` in your app
2. Create a new doctor account
3. Check email for verification (if enabled)
4. Verify doctor profile was created in database

### 5.3 Test Login Flow

1. Go to `/login`
2. Sign in with your new account
3. Verify you can access the dashboard

## 🔍 Step 6: Verify Demo Mode is Off

Check the browser console when on the dashboard. You should see:

```
Demo mode? false
```

## 📊 Step 7: Add Sample Data (Optional)

Once you can log in, you can add some test patients and appointments through the app UI, or insert sample data via SQL:

```sql
-- Add sample patient (replace doctor_id with your actual user ID)
INSERT INTO patients (doctor_id, name, dob, phone, email, medical_history)
VALUES (
  'your-user-id-here',
  'John Doe',
  '1985-06-15',
  '(555) 123-4567',
  'john.doe@email.com',
  'No known allergies. History of hypertension.'
);

-- Add sample appointment
INSERT INTO appointments (doctor_id, patient_id, date, time, reason, status)
VALUES (
  'your-user-id-here',
  'patient-id-from-above',
  '2024-01-25',
  '10:00',
  'Annual Checkup',
  'confirmed'
);
```

## 🚨 Troubleshooting

### Authentication Issues

- Check `.env.local` file exists and has correct credentials
- Verify Supabase project is active
- Check browser console for errors

### Database Issues

- Verify all SQL commands ran successfully
- Check RLS policies are enabled
- Ensure triggers are created

### App Issues

- Clear browser localStorage/sessionStorage
- Restart development server
- Check browser console for JavaScript errors

## 🛡️ Security Notes

✅ **What's Secured:**

- Row Level Security ensures doctors only see their own data
- Authentication required for all database operations
- Automatic doctor profile creation on signup

⚠️ **Production Considerations:**

- Enable email confirmation for signup
- Set up proper email templates
- Configure custom domain for auth redirects
- Review and audit RLS policies
- Set up database backups

## 📞 Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify the database setup completed successfully
4. Ensure all environment variables are set correctly
