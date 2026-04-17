# Contact Form UX Refinement

## CURRENT ISSUES

### 1. Layout Problems
- ❌ Company field in `grid-cols-2` but uses only 1 column (visual imbalance)
- ❌ Budget + Timeline nested in grid-within-grid (overly complex)
- ❌ No visual hierarchy - all fields feel equally important
- ❌ 9 visible fields hit user immediately (cognitive overload)

### 2. Label & Guidance Issues
- ❌ "Phone (optional)" in label - should use helper text
- ❌ Placeholders used as examples ("John", "Your Company") - not accessible
- ❌ No helper text explaining what's expected
- ❌ "Message" field has no context about what to include

### 3. Flow Problems
- ❌ Company required but many users may not have one
- ❌ Project details scattered (type, budget, timeline not clearly grouped)
- ❌ No progressive disclosure for optional fields
- ❌ Budget/timeline appear before user describes project

---

## RECOMMENDED STRUCTURE

### FIELD ORDER (Top to Bottom)

```
┌─────────────────────────────────────┐
│ 1. YOUR INFORMATION (Heading)       │
│    ├─ Full Name (required)          │
│    ├─ Email (required)              │
│    └─ Phone (optional, collapsed)   │
│                                      │
│ 2. ABOUT YOUR PROJECT (Heading)     │
│    ├─ What do you need? (required)  │
│    └─ Tell us more (required)       │
│                                      │
│ 3. PROJECT DETAILS (Optional)       │
│    ├─ Company Name (optional)       │
│    ├─ Budget Range (optional)       │
│    └─ Timeline (optional)           │
│                                      │
│ 4. Consent checkbox (required)      │
│                                      │
│ 5. Submit Button                    │
└─────────────────────────────────────┘
```

---

## DETAILED FIELD SPECIFICATIONS

### GROUP 1: YOUR INFORMATION
**Visual:** Light background, rounded border, padding

#### Field: Full Name
```jsx
<label>
  Full Name
  <span className="text-red-500">*</span>
</label>
<Input id="fullName" />
<span className="helper-text">
  First and last name
</span>
```

**Why single field?**
- Reduces friction (1 field vs 2)
- Better for international names (some cultures don't use Western first/last format)
- Less intimidating at form start

**Alternative (if split needed):**
```jsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <label>First Name <span>*</span></label>
    <Input />
  </div>
  <div>
    <label>Last Name <span>*</span></label>
    <Input />
  </div>
</div>
```

#### Field: Email
```jsx
<label>
  Email Address
  <span className="text-red-500">*</span>
</label>
<Input type="email" id="email" />
<span className="helper-text">
  We'll send project updates here
</span>
```

**No placeholder** - screen readers skip placeholders

#### Field: Phone (Progressive Disclosure)
```jsx
<button type="button" className="text-sm text-gold">
  + Add phone number (optional)
</button>

{/* When expanded: */}
<label>
  Phone Number
  <span className="text-muted-foreground text-xs ml-2">Optional</span>
</label>
<Input type="tel" id="phone" />
<span className="helper-text">
  Include country code (e.g., +977)
</span>
```

**Why collapsible?**
- Reduces initial form length
- Makes form feel easier
- Most important contact is email anyway

---

### GROUP 2: ABOUT YOUR PROJECT
**Visual:** Slightly darker background to separate from personal info

#### Field: Project Type
```jsx
<label>
  What do you need help with?
  <span className="text-red-500">*</span>
</label>
<select id="projectType">
  <option value="">Choose one...</option>
  <option value="web-app">Website or Web Application</option>
  <option value="mobile-app">Mobile App Development</option>
  <option value="ai-automation">AI & Workflow Automation</option>
  <option value="data">Data Analytics & Dashboards</option>
  <option value="cloud">Cloud Infrastructure & DevOps</option>
  <option value="security">Cybersecurity & Compliance</option>
  <option value="integration">System Integration</option>
  <option value="support">Maintenance & Support</option>
  <option value="consulting">IT Consulting</option>
  <option value="other">Something else</option>
</select>
```

**Changes:**
- More conversational label ("What do you need help with?" vs "Project Type")
- Shorter option text
- "Choose one..." vs "Select..." (more friendly)

#### Field: Message
```jsx
<label>
  Tell us about your project
  <span className="text-red-500">*</span>
</label>
<Textarea id="message" rows={5} />
<span className="helper-text">
  What problem are you trying to solve? What are your goals?
</span>
<span className="character-count">
  {message.length} / 10 minimum
</span>
```

**Changes:**
- More specific label (not just "Message")
- Helper text guides what to write
- Character count shows progress toward minimum
- No placeholder (accessibility)

---

### GROUP 3: PROJECT DETAILS (Optional Section)
**Visual:** Collapsible accordion or lighter background

**Header:**
```jsx
<button type="button" className="accordion-trigger">
  Project Details (Optional)
  <span className="text-xs text-muted">
    Help us prepare a better estimate
  </span>
</button>
```

**Why collapsible?**
- Reduces cognitive load
- Makes form feel shorter
- Users can skip if uncertain
- Still accessible for those who want to provide details

#### Field: Company Name
```jsx
<label>
  Company Name
  <span className="text-muted-foreground text-xs ml-2">Optional</span>
</label>
<Input id="company" />
<span className="helper-text">
  Leave blank if you're an individual
</span>
```

**Changes:**
- Made optional (not everyone has a company)
- Explicit permission to leave blank
- No longer required in schema

#### Field: Budget Range
```jsx
<label>
  Budget Range
  <span className="text-muted-foreground text-xs ml-2">Optional</span>
</label>
<select id="budget">
  <option value="">Prefer not to say</option>
  <option value="under-5k">Under $5,000</option>
  <option value="5k-10k">$5,000 - $10,000</option>
  <option value="10k-25k">$10,000 - $25,000</option>
  <option value="25k-50k">$25,000 - $50,000</option>
  <option value="50k-plus">$50,000+</option>
  <option value="ongoing">Ongoing Retainer</option>
</select>
<span className="helper-text">
  Helps us recommend the right solution
</span>
```

**Changes:**
- Select instead of free text (easier, less intimidating)
- "Prefer not to say" as default (respectful)
- Ranges instead of exact amounts (less pressure)

#### Field: Timeline
```jsx
<label>
  When do you need this?
  <span className="text-muted-foreground text-xs ml-2">Optional</span>
</label>
<select id="timeline">
  <option value="">Not sure yet</option>
  <option value="asap">As soon as possible</option>
  <option value="1-month">Within 1 month</option>
  <option value="1-3-months">1-3 months</option>
  <option value="3-6-months">3-6 months</option>
  <option value="6-plus-months">6+ months</option>
  <option value="exploring">Just exploring options</option>
</select>
<span className="helper-text">
  We'll work with your schedule
</span>
```

**Changes:**
- More conversational label
- Select instead of free text
- "Just exploring" option (welcomes early-stage inquiries)
- Reassuring helper text

---

### CONSENT
```jsx
<div className="flex items-start gap-3 rounded-lg border border-muted p-4 bg-muted/20">
  <Checkbox id="agree" />
  <label htmlFor="agree" className="text-sm leading-relaxed">
    I understand that Triovate Labs will use my information to
    respond to my inquiry and may contact me about relevant services.
    <a href="/privacy" className="text-gold hover:underline ml-1">
      Privacy Policy
    </a>
  </label>
</div>
```

**Changes:**
- Specific language (what data is used for)
- Link to privacy policy inline
- Visual container to draw attention
- Plain language, not legalese

---

### SUBMIT BUTTON
```jsx
<Button
  type="submit"
  size="lg"
  className="w-full"
  disabled={!isValid || isSubmitting}
>
  {isSubmitting ? (
    <>
      <Spinner className="mr-2" />
      Sending...
    </>
  ) : (
    'Send Message'
  )}
</Button>

{!isValid && (
  <p className="text-xs text-muted-foreground text-center">
    Please fill in all required fields
  </p>
)}
```

**Changes:**
- Loading state with spinner
- Clear validation feedback
- Respectful of user's time

---

## VISUAL GROUPING

### Method 1: Background Colors
```css
.form-group-primary {
  background: hsl(var(--muted) / 0.3);
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 24px;
}

.form-group-secondary {
  background: hsl(var(--muted) / 0.15);
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 24px;
}
```

### Method 2: Section Headers
```jsx
<div className="space-y-6">
  <div>
    <h3 className="text-lg font-semibold mb-1">Your Information</h3>
    <p className="text-sm text-muted-foreground">
      How should we reach you?
    </p>
  </div>

  {/* Fields... */}
</div>
```

### Method 3: Dividers
```jsx
<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />
```

---

## FIELD SPACING

```css
.form-field {
  margin-bottom: 20px; /* Between fields within a group */
}

.form-group {
  margin-bottom: 32px; /* Between groups */
}

.helper-text {
  margin-top: 4px;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  line-height: 1.4;
}

.error-text {
  margin-top: 4px;
  font-size: 0.875rem;
  color: hsl(var(--destructive));
}
```

---

## ACCESSIBILITY IMPROVEMENTS

### 1. Required Field Indicators
```jsx
<label>
  Email Address
  <span className="text-red-500" aria-label="required">*</span>
</label>
```

### 2. Error Messages
```jsx
{errors.email && (
  <p
    className="text-xs text-red-500"
    role="alert"
    id="email-error"
  >
    {errors.email.message}
  </p>
)}

<Input
  aria-invalid={errors.email ? "true" : "false"}
  aria-describedby={errors.email ? "email-error" : "email-help"}
/>
```

### 3. Helper Text IDs
```jsx
<Input aria-describedby="email-help" />
<span id="email-help" className="helper-text">
  We'll send project updates here
</span>
```

---

## SCHEMA CHANGES

```typescript
const schema = z.object({
  // Primary fields
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),

  // Optional contact
  phone: z.string().optional(),

  // Project info
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Please tell us a bit more (at least 10 characters)"),

  // Optional details
  company: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),

  // Required consent
  agree: z.boolean().refine((v) => v === true, {
    message: "Please accept to continue"
  }),

  // Honeypot
  website: z.string().optional(),
});
```

---

## PROGRESSIVE DISCLOSURE LOGIC

```jsx
const [showPhone, setShowPhone] = useState(false);
const [showDetails, setShowDetails] = useState(false);

// Auto-expand details if user fills project type
useEffect(() => {
  if (watch("projectType")) {
    setShowDetails(true);
  }
}, [watch("projectType")]);
```

---

## MICROCOPY IMPROVEMENTS

| Old | New | Why |
|-----|-----|-----|
| "First Name" | "Full Name" | Less friction, one field |
| "Phone (optional)" | "Phone Number" + helper | Cleaner label |
| "Company" (required) | "Company Name" (optional) | Not everyone has one |
| "Project Type" | "What do you need help with?" | Conversational |
| "Message" | "Tell us about your project" | Specific guidance |
| "Budget" | "Budget Range" | Less intimidating |
| "Timeline" | "When do you need this?" | Conversational |
| "I agree to privacy policy" | "I understand that..." | Specific, clear |

---

## FINAL CHECKLIST

✅ Fields ordered by commitment level (easy → detailed)
✅ Visual grouping (backgrounds, headers, spacing)
✅ Required vs optional clearly marked
✅ Helper text instead of placeholders
✅ Progressive disclosure reduces cognitive load
✅ Conversational labels feel respectful
✅ Validation messages are helpful, not punishing
✅ Accessibility: ARIA labels, error IDs, roles
✅ Mobile-friendly (no complex nested grids)
✅ Submit button shows loading state

---

## PSYCHOLOGICAL FLOW

1. **Name & Email** → "This is easy, I can do this"
2. **Project Type** → "They're asking the right questions"
3. **Message** → "I'm ready to explain now"
4. **Details** → "Optional, but helpful if I know"
5. **Consent** → "Clear and fair"
6. **Submit** → "I feel good about this"

**Result:** User feels respected, not interrogated.
