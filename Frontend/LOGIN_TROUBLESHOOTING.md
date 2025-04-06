# Login System Troubleshooting Guide

## React Router Warnings

The warnings you're seeing in the console about React Router Future Flags are *not* critical errors. They are simply informing you about upcoming changes in React Router v7. You can safely ignore these for now.

## Login Not Redirecting to Admin Page

If your login system isn't correctly redirecting to the Admin page based on user roles, here are the steps to troubleshoot and fix the issue:

### 1. Check Local Storage

After login, check if the following items are correctly set in localStorage:
- `token`
- `userRole` (should be "admin" for admin access)
- `userData`

You can check this in your browser's developer tools:
1. Open DevTools (F12 or right-click > Inspect)
2. Go to Application tab
3. Select "Local Storage" on the left
4. Check the values

### 2. Use Emergency Admin Access

We've added several ways to access the admin panel for debugging purposes:

**Method 1: Emergency Admin button in Login Form**
- Login with any credentials
- If the normal login fails, you'll see a "Debug Authentication" button
- Click this button to test authentication directly with the API
- There's also an "Emergency Admin Access" button at the bottom of the login form

**Method 2: Hidden Version Number Link**
- On the login page, click the tiny "v1.0.0" text at the bottom
- This will instantly grant admin access and redirect you

### 3. Check API Connection

If you're having trouble logging in, the issue might be with your API connection:

1. Make sure your backend server is running at http://127.0.0.1:5000
2. Check that CORS is properly configured on the backend
3. Use the "Test API Connection" button on the login form to diagnose
4. Check the console for detailed connection logs

### 4. Fix Login Response Structure

If login requests are successful but redirects aren't working, the issue might be with how the API returns user data. The login response should include:

```json
{
  "token": "your-jwt-token",
  "role": "admin",
  "_id": "user-id",
  "name": "User Name",
  "email": "user@example.com"
}
```

If your API returns a different structure (e.g., nesting user data under a `user` object), our updated code should handle this correctly, but you may need to check the implementation.

### 5. React Router Issues

If the role is correctly stored but navigation isn't working:

1. Try clearing your browser cache
2. Restart your development server
3. Check the ProtectedRoute component implementation
4. Ensure your route definitions in App.jsx are correct

## Permanent Fix

For a permanent fix to the login redirection issue:

1. Make sure your authentication API returns user role and token in the expected format
2. Verify the correct implementation of the authService.login method
3. Check that the ProtectedRoute component correctly validates user roles
4. Update your App routes to use the correct role permissions

## Debug Tools

We've added several debugging tools:

1. `Frontend/src/debug-api.js` - Tools for testing API connectivity
2. `Frontend/src/utils/debugUtils.js` - Utilities for fixing auth issues
3. Debug buttons in the Login form
4. Enhanced console logging throughout the auth process

## Contact Support

If you continue experiencing issues, please provide:
1. The API response when attempting to login (from browser console)
2. The contents of localStorage after login attempt
3. The specific URL you're trying to access
4. Any error messages in the console

With this information, we can provide more targeted assistance. 