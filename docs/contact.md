# Contact Page

**Route:** `/contact`

## Hero Section

### Main Headline
**Get In Touch**

### Description
Ready to transform your business? Let's discuss your project and explore how we can help you achieve your goals.

---

## Contact Information

### Email
**info@triovatelabs.com**
Reach us anytime

### Phone
**+977-9707098190**
Available Mon–Fri

### Location
**Kathmandu, Nepal**
Based in Kathmandu
Remote-first, global collaboration

---

## Contact Form: Start Your Project

The contact form includes the following fields:

### Personal Information
- **Full Name** (required)
- **Email** (required, validated)
- **Phone Number** (required, validated with international format support)
- **Company Name** (required)

### Project Details
- **Project Type** (required, dropdown):
  - Website Development
  - Mobile Application Development
  - Paid Ads Management
  - Social Media Management
  - IT Consultation
  - Maintenance & Support

- **Budget** (required, dropdown):
  - Rs. 50K - 1L
  - 1L - 3L
  - 3L+

- **Timeline** (required, dropdown):
  - 4-6 weeks
  - 8-12 weeks
  - 12 weeks+

- **Project Details** (required, minimum 10 characters)
  Tell us about your project requirements...

### Privacy Consent
- Checkbox: "I agree to the privacy policy and understand how my data will be used." (required)
- Link to: `/privacy-policy`

### Submit Button
**Let's Build Your Solution**

---

## Form Features

### Validation
- Real-time form validation using Zod schema
- Field-level error messages
- Phone number regex validation for international formats
- Email format validation
- Minimum character requirements for message field
- Form-wide validation status

### Security
- Honeypot field (`website`) to prevent spam submissions
- Client-side validation before submission
- Data attribute tracking for analytics

### User Experience
- Auto-focus on full name field when navigating with `#start` hash
- Toast notification on successful submission
- Form reset after submission
- Disabled submit button when form is invalid
- Clear error messaging

---

## Form Submission Flow

1. User fills out all required fields
2. Real-time validation provides immediate feedback
3. Submit button becomes enabled when form is valid
4. On submit, honeypot check is performed
5. Analytics attribute is set on form element
6. Toast notification confirms submission
7. Form is reset for new entries

---

## Design Elements

- Tech-themed background with circuit patterns
- Animated decorative elements
- Gold accent colors for highlights and focus states
- Card-based layout for form and contact info
- Responsive grid layout
- Hover effects on contact info cards
- Scroll reveal animations
