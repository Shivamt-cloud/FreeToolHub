# 📧 EmailJS Setup Guide for FreeToolHub

This guide will help you set up EmailJS to enable contact form emails on your FreeToolHub website.

## 🚀 **Step-by-Step Setup**

### **Step 1: Create EmailJS Account**

1. **Visit EmailJS**: https://www.emailjs.com/
2. **Click "Sign Up"** and create your account
3. **Verify your email** when prompted
4. **Login to your dashboard**: https://dashboard.emailjs.com/

### **Step 2: Add Email Service**

1. **Go to "Email Services"** in the left sidebar
2. **Click "Add New Service"**
3. **Choose your email provider**:
   - **Gmail** (recommended for testing)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**

#### **Gmail Setup (Recommended)**
1. **Select "Gmail"**
2. **Click "Connect Account"**
3. **Sign in with your Gmail account**
4. **Grant permissions** to EmailJS
5. **Copy the Service ID** (e.g., `service_abc123`)

### **Step 3: Create Email Template**

1. **Go to "Email Templates"** in the left sidebar
2. **Click "Create New Template"**
3. **Use this template content**:

```html
Subject: New Contact Form Submission - FreeToolHub

From: {{from_name}} ({{from_email}})
Message: {{message}}

---
This message was sent from the FreeToolHub contact form.
```

4. **Save the template** and **copy the Template ID** (e.g., `template_xyz789`)

### **Step 4: Get Your Public Key**

1. **Go to "Account"** in the left sidebar
2. **Find "Public Key"** section
3. **Copy your Public Key** (e.g., `user_abc123def456`)

### **Step 5: Update Your Website**

1. **Open `index.html`** in your project
2. **Find line 14047** and replace `YOUR_PUBLIC_KEY` with your actual public key
3. **Find line 14075** and replace:
   - `YOUR_SERVICE_ID` with your service ID
   - `YOUR_TEMPLATE_ID` with your template ID

#### **Example Update:**
```javascript
// Line 14047
emailjs.init('user_abc123def456');

// Line 14075
emailjs.send('service_abc123', 'template_xyz789', formData)
```

## 🔧 **Configuration Details**

### **Required Replacements in `index.html`:**

| Line | Current | Replace With |
|------|---------|--------------|
| 14047 | `'YOUR_PUBLIC_KEY'` | Your EmailJS Public Key |
| 14075 | `'YOUR_SERVICE_ID'` | Your Email Service ID |
| 14075 | `'YOUR_TEMPLATE_ID'` | Your Email Template ID |

### **Email Template Variables:**

The contact form sends these variables to your email template:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{message}}` - User's message
- `{{to_name}}` - Always "FreeToolHub Team"

## 🧪 **Testing Your Setup**

1. **Save your changes** to `index.html`
2. **Refresh your website**
3. **Go to the "Get in Touch" section**
4. **Fill out the contact form** with test data
5. **Click "Send Message"**
6. **Check your email** for the message

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"EmailJS is not defined"**
   - Make sure the EmailJS script is loaded
   - Check browser console for errors

2. **"Invalid public key"**
   - Verify your public key is correct
   - Check for extra spaces or characters

3. **"Service not found"**
   - Verify your service ID is correct
   - Make sure the service is active

4. **"Template not found"**
   - Verify your template ID is correct
   - Make sure the template is published

### **Debug Steps:**

1. **Open browser console** (F12)
2. **Submit the contact form**
3. **Check for error messages**
4. **Verify all IDs are correct**

## 📱 **EmailJS Dashboard Links**

- **Dashboard**: https://dashboard.emailjs.com/
- **Email Services**: https://dashboard.emailjs.com/admin
- **Email Templates**: https://dashboard.emailjs.com/admin/templates
- **Account Settings**: https://dashboard.emailjs.com/admin/integration

## 🎯 **Next Steps**

After setting up EmailJS:

1. **Test the contact form** thoroughly
2. **Deploy your website** to your hosting platform
3. **Monitor email delivery** in your EmailJS dashboard
4. **Set up email notifications** for new submissions

## 📞 **Support**

- **EmailJS Documentation**: https://www.emailjs.com/docs/
- **EmailJS Support**: https://www.emailjs.com/support/
- **FreeToolHub Issues**: Create an issue in your GitHub repository

---

**✅ Once completed, your contact form will send real emails to your inbox!**
