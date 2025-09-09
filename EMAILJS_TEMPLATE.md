# 📧 EmailJS Template for FreeToolHub Contact Form

## 🎯 **Copy & Paste Template**

### **Step 1: Email Template Content**

Copy this template content into your EmailJS dashboard:

**Template Name:** `freetoolhub_contact_form`

**Subject:** `New Contact Form Submission from {{from_name}}`

**Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #667eea; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 New Contact Form Submission</h2>
            <p>Someone has contacted you through FreeToolHub!</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">{{from_name}}</div>
            </div>
            
            <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value">{{from_email}}</div>
            </div>
            
            <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">{{message}}</div>
            </div>
            
            <div class="field">
                <div class="label">📅 Submitted:</div>
                <div class="value">{{timestamp}}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent from your FreeToolHub contact form.</p>
            <p>Reply directly to this email to respond to {{from_name}}.</p>
        </div>
    </div>
</body>
</html>
```

### **Step 2: Template Variables**

Make sure these variables are configured in your EmailJS template:

- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{message}}` - Message content
- `{{timestamp}}` - Submission timestamp

### **Step 3: Service Configuration**

**Service Name:** `gmail_service`

**Service Type:** Gmail

**Configuration:**
- Connect your Gmail account
- Grant necessary permissions
- Copy the Service ID (format: `service_xxxxxxx`)

### **Step 4: Update Your Website**

Replace these values in your `index.html` file:

```javascript
// Line 14047 - Replace YOUR_PUBLIC_KEY
emailjs.init('YOUR_PUBLIC_KEY_HERE');

// Line 14072 - Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID
emailjs.send('YOUR_SERVICE_ID_HERE', 'YOUR_TEMPLATE_ID_HERE', formData)
```

### **Step 5: Test Configuration**

After setup, test with this sample data:

```javascript
const testData = {
    from_name: "Test User",
    from_email: "test@example.com",
    message: "This is a test message from FreeToolHub contact form.",
    timestamp: new Date().toLocaleString()
};
```

## 🚀 **Quick Setup Checklist**

- [ ] Create EmailJS account
- [ ] Add Gmail service
- [ ] Create email template with above content
- [ ] Get Public Key from Account settings
- [ ] Get Service ID from Email Services
- [ ] Get Template ID from Email Templates
- [ ] Update index.html with your credentials
- [ ] Test the contact form

## 📱 **Template Features**

✅ **Professional HTML email design**  
✅ **Responsive layout**  
✅ **Branded colors matching FreeToolHub**  
✅ **Clear field labels with icons**  
✅ **Automatic timestamp**  
✅ **Direct reply functionality**  
✅ **Mobile-friendly design**

## 🔧 **Troubleshooting**

If emails aren't sending:

1. **Check Public Key** - Must be from Account > Integration
2. **Verify Service ID** - Must be from Email Services
3. **Confirm Template ID** - Must be from Email Templates
4. **Test with simple template first** - Use basic text template
5. **Check browser console** - Look for JavaScript errors

## 📞 **Support**

- EmailJS Documentation: https://www.emailjs.com/docs/
- FreeToolHub Support: Contact through the website
- Template Issues: Check variable names match exactly
