# NovaDocs API Testing - Enhanced Postman Setup Guide

## 📋 Overview

This guide explains how to set up and use the enhanced Postman collection with **automatic token management** for testing the NovaDocs API.

## 🚀 Quick Setup

### 1. Import the Enhanced Collection

1. Open Postman
2. Click **Import** in the top-left
3. Select `NovaDocs_API_Collection_Enhanced.json`
4. The collection will be imported with automatic token management

### 2. Import the Environment

1. In Postman, click the **Environments** tab (gear icon)
2. Click **Import**
3. Select `NovaDocs_Environment.postman_environment.json`
4. Select the "NovaDocs Development Environment" from the environment dropdown

### 3. Verify Server is Running

Make sure your NovaDocs server is running:

```bash
cd /Users/shivam/Desktop/enterprise-notion/server
npm run dev
```

Server should be running on `http://localhost:4567`

## 🔄 Automatic Token Management Features

### ✅ What's Automated

1. **Collection-Level Auth**: All requests automatically use `Bearer {{auth_token}}`
2. **Auto-Save Tokens**: Login/Register automatically save tokens to environment
3. **Auto-Save IDs**: Workspace and document IDs are automatically captured
4. **Token Expiry Tracking**: Tracks when tokens expire
5. **Random Data**: Uses Postman dynamic variables for realistic test data
6. **Comprehensive Testing**: Built-in test assertions with detailed console logs

### 🔑 Token Flow

1. **Register/Login** → Token automatically saved to `{{auth_token}}`
2. **All other requests** → Automatically include `Authorization: Bearer {{auth_token}}`
3. **No manual copying** → Everything is automated!

## 📝 Testing Workflow

### Complete User Journey (Recommended Order)

1. **🔐 Authentication → Register User**

   - Creates new user with random data
   - Auto-saves token, user ID, and default workspace ID

2. **🏢 Workspaces → Get User Workspaces**

   - Lists all workspaces
   - Auto-saves first workspace ID

3. **🏢 Workspaces → Create Workspace**

   - Creates new workspace with random name
   - Auto-saves new workspace ID

4. **📄 Documents → Create Document**

   - Creates document in current workspace
   - Auto-saves document ID

5. **📄 Documents → Get Documents in Workspace**

   - Lists all documents in workspace

6. **📄 Documents → Update Document**

   - Updates the created document

7. **📄 Documents → Delete Document**

   - Cleans up test document

8. **🏢 Workspaces → Delete Workspace**
   - Cleans up test workspace

### Individual Testing

You can also run any request individually - they all use the saved token automatically.

## 🎯 Key Environment Variables

| Variable       | Description              | Auto-Populated |
| -------------- | ------------------------ | -------------- |
| `auth_token`   | JWT authentication token | ✅ Yes         |
| `user_id`      | Current user ID          | ✅ Yes         |
| `workspace_id` | Current workspace ID     | ✅ Yes         |
| `document_id`  | Current document ID      | ✅ Yes         |
| `base_url`     | API base URL             | ✅ Yes         |

## 🔍 Console Output

Each request provides detailed console output:

```
✅ User registered and token saved
Token: eyJhbGciOiJIUzI1NiIs...
User ID: 507f1f77bcf86cd799439011
Default Workspace ID: 507f1f77bcf86cd799439012

✅ Found 2 workspace(s)
First workspace ID saved: 507f1f77bcf86cd799439013
Workspace name: My Workspace

✅ Document created: Important Notes Document
Document ID: 507f1f77bcf86cd799439014
```

## 🛠️ Troubleshooting

### Token Issues

If you get `401 Unauthorized`:

1. **Check environment**: Make sure "NovaDocs Development Environment" is selected
2. **Re-authenticate**: Run "Register User" or "Login User" again
3. **Check token**: Verify `{{auth_token}}` is populated in environment

### Server Issues

If requests fail to connect:

1. **Verify server**: Check that server is running on `http://localhost:4567`
2. **Check logs**: Look at server console for errors
3. **Test manually**: Try `curl http://localhost:4567/api/user/profile`

### Missing Data

If workspace/document IDs are missing:

1. **Run in order**: Follow the recommended testing workflow
2. **Check responses**: Ensure previous requests succeeded (status 200/201)
3. **Manual setup**: Set variables manually if needed

## 🔧 Advanced Usage

### Custom Test Data

To use specific test data instead of random data:

1. Edit request body before sending
2. Replace `{{$randomEmail}}` with `test@example.com`
3. Replace `{{$randomCompanyName}}` with `Test Company`

### Running Multiple Tests

1. **Collection Runner**: Use Postman's Collection Runner for automated testing
2. **Newman CLI**: Export and run with Newman for CI/CD integration
3. **Monitors**: Set up Postman Monitors for continuous testing

### Environment Variables

Add custom variables in the environment:

```json
{
  "key": "custom_workspace_name",
  "value": "My Test Workspace",
  "enabled": true
}
```

## 📊 Test Results

The enhanced collection includes test assertions that will show:

- ✅ **Green**: All tests passed
- ❌ **Red**: Some tests failed
- 📊 **Summary**: Total requests, tests, and failures

## 🎉 Benefits of Enhanced Collection

1. **Zero Manual Work**: No copying/pasting tokens
2. **Realistic Data**: Random names, emails, content
3. **Comprehensive Testing**: Built-in assertions
4. **Clear Feedback**: Detailed console logs
5. **Easy Workflow**: Logical request ordering
6. **Production Ready**: Follows API best practices

## 🚀 Next Steps

After successful API testing:

1. **Phase 2.1**: Implement frontend integration
2. **Error Handling**: Test error scenarios
3. **Performance**: Test with larger datasets
4. **Security**: Validate authentication edge cases

---

**Ready to test?** Start with "🔐 Authentication → Register User" and follow the workflow! 🎯
