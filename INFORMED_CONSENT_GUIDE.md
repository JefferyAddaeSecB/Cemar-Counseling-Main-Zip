# Informed Consent & Policies – Integration Guide

## Overview

The Cemar Counseling website now includes a comprehensive **Informed Consent & Policies** page that serves as a legal acknowledgment document for all prospective clients before booking appointments.

---

## Document Structure

The informed consent document covers 12 key sections:

1. **Purpose of Counseling** – What counseling is and realistic outcome expectations
2. **Nature of Counseling Services** – Types of services offered (individual, group, online, etc.)
3. **Not a Medical or Emergency Service** – Clear disclaimer that this is not emergency care
4. **Client Responsibilities** – Client participation and disclosure obligations
5. **Risks and Benefits** – Potential positive and negative outcomes
6. **Confidentiality** – Privacy protections and legal exceptions
7. **Records and Documentation** – Data storage and client access rights
8. **Fees and Payment Policy** – Pricing, payment methods, and confirmation requirements
9. **Cancellation, Rescheduling, and No-Show Policy** – 24-hour cancellation requirement
10. **Technology and Virtual Sessions** – Technical considerations for online sessions
11. **Professional Boundaries** – Ethical guidelines and prohibited conduct
12. **Consent to Services** – Client acknowledgment and voluntary agreement

Plus:
- **Emergency/Crisis Disclaimer** – Prominent crisis hotline information
- **Final Acknowledgment** – Comprehensive agreement checklist

---

## Accessing the Page

### Direct URL
```
https://yourdomain.com/informed-consent
```

### Navigation
- **Footer link**: Added to main footer under "Informed Consent" (visible on all pages)
- **Public access**: No login required; accessible to all visitors

---

## Features

### 1. Print / Save as PDF
- **Button Location**: Top-right of the page
- **How It Works**: Click "Print / Save as PDF" → Use browser print dialog (Cmd+P on Mac, Ctrl+P on Windows)
- **Output**: Professional, formatted PDF suitable for records or sharing

### 2. Mobile Responsive
- Fully responsive design (mobile, tablet, desktop)
- Readable on all screen sizes
- Print styles optimize for paper

### 3. Dark Mode Support
- Automatically adapts to system dark mode preference
- Maintains readability in both light and dark themes

### 4. Accessibility
- Semantic HTML structure
- Numbered sections with visual badges
- Clear visual hierarchy
- Emergency notice prominently displayed

---

## Integration with Calendly

### How to Require Informed Consent Before Booking

Calendly does not directly support enforcing consent checks within the scheduling widget. However, you have two options:

#### Option 1: Instructional Link (Recommended)
1. Add this text to your Calendly event description or booking page:
   ```
   "By booking this appointment, you acknowledge that you have read and agree to our 
   Informed Consent & Policies: https://yourdomain.com/informed-consent"
   ```

2. Clients can review the document before or after booking (they receive a copy via Calendly confirmation email)

#### Option 2: Pre-Booking Acknowledgment Page
1. Create a modal or landing page that displays key consent points
2. Require users to check a "I Agree" checkbox before opening Calendly
3. Add this to the booking flow:

```tsx
// Example snippet for pre-booking consent modal
const [consentAgreed, setConsentAgreed] = useState(false);

return (
  <>
    {!consentAgreed ? (
      <div className="modal">
        <h2>Informed Consent Required</h2>
        <p>Please review our <a href="/informed-consent">Informed Consent & Policies</a></p>
        <input 
          type="checkbox" 
          onChange={(e) => setConsentAgreed(e.target.checked)}
        />
        <label>I have read and agree to the Informed Consent & Policies</label>
      </div>
    ) : (
      <CalendlyWidget />
    )}
  </>
);
```

---

## Legal Defensibility

This document is designed to be:

- **Transparent**: Clear language without medical jargon
- **Comprehensive**: Covers all major liability and service boundaries
- **Regulatory-compliant**: Includes required crisis disclaimers and confidentiality exceptions
- **Payment-processor-friendly**: Suitable for Stripe, PayPal, and other payment systems
- **Practice-management-ready**: Structured for future migration to Jane App or similar platforms

### When to Update

Review and update this document:
- Annually or when policies change
- If payment methods are added/removed
- If cancellation policies change
- If emergency resources need updating
- If new service types are offered

**Last Updated**: January 2026  
**Current Version**: 1.0

---

## Technical Details

### File Location
```
src/pages/informed-consent/page.tsx
```

### Route
```
/informed-consent
```

### Dependencies
- React Router (for navigation)
- Framer Motion (for animations)
- Lucide Icons (for download/home icons)

### Print Styles
The page includes built-in CSS for optimal print/PDF output:
- Professional page breaks
- Hidden interactive elements during print
- Proper margins (0.75in default)
- Orphan/widow control for text

---

## PDF Export Instructions

### For End Users

1. **On Desktop**:
   - Click "Print / Save as PDF" button, OR
   - Press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
   - Select "Save as PDF" in the print dialog
   - Choose location and filename

2. **On Mobile**:
   - Open the page in your browser
   - Tap share icon → "Print" (iOS) or "Share" → "Print" (Android)
   - Select "Save as PDF"

### For Administrators

To archive copies:
1. Visit `/informed-consent` on your site
2. Print to PDF with date in filename (e.g., `CEMAR_Informed_Consent_2026-01-12.pdf`)
3. Store in secure record-keeping system

---

## Customization

### To Edit Content

Edit `src/pages/informed-consent/page.tsx` and modify the `sections` array:

```tsx
const sections = [
  {
    number: "1",
    title: "Purpose of Counseling",
    content: `Your updated content here...`
  },
  // ... more sections
]
```

### To Change Colors

Replace color references:
- `#30D5C8` → Primary teal (update to your brand color)
- `#008080` → Secondary dark teal (update to your brand color)

### To Add Sections

Add new objects to the `sections` array following the same structure.

---

## Footer Integration

The "Informed Consent" link is now in the footer alongside:
- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)

To modify footer links, edit `src/components/footer.tsx`.

---

## Next Steps

1. **Review & Legal**: Have a lawyer review this document for your jurisdiction
2. **Customize**: Update therapist name, contact methods, and specific policies
3. **Test**: Visit `/informed-consent` and test print-to-PDF function
4. **Promote**: Add link to your booking confirmation emails and website footer
5. **Archive**: Save periodic PDF copies for compliance records

---

## Questions?

For technical questions about the implementation, see:
- React Router documentation: https://reactrouter.com
- Framer Motion documentation: https://www.framer.com/motion

For legal questions about informed consent in your jurisdiction, consult a healthcare attorney.

---

**Cemar Counseling © 2026**
