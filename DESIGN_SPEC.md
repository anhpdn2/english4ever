# English4Ever - Design Specification
## Inspired by Memrise's Clean Learning Experience

---

## 🎨 Design Philosophy

**Core Principles:**
- **Minimal Distractions**: Clean, focused interface that keeps attention on learning
- **Centered Content**: Cards and content centered on screen like Memrise
- **Generous White Space**: Breathing room around elements
- **Playful but Professional**: Friendly without being childish
- **Mobile-First**: Design for mobile, scale up to desktop

---

## 🎨 Color Palette

### Primary Colors
- **Primary Blue**: `#2B70C9` - Main brand color, buttons, progress
- **Primary Blue Hover**: `#1E5BA8` - Hover states
- **Success Green**: `#4CAF50` - Correct answers, completion
- **Error Red**: `#F44336` - Wrong answers, alerts
- **Warning Yellow**: `#FFC107` - Hints, warnings

### Neutral Colors
- **Background**: `#F5F7FA` - Page background (light gray-blue)
- **Card White**: `#FFFFFF` - Card backgrounds
- **Text Primary**: `#2C3E50` - Main text
- **Text Secondary**: `#7F8C8D` - Secondary text, hints
- **Border Light**: `#E0E6ED` - Subtle borders
- **Border Medium**: `#CBD5E0` - Card borders

### Accent Colors
- **Purple**: `#9B59B6` - Streaks, achievements
- **Orange**: `#FF9800` - Highlights, emphasis

---

## 📝 Typography

### Font Family
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Fallback**: System fonts for performance

### Font Sizes (Desktop)
- **Heading 1**: 32px / 2rem - Page titles
- **Heading 2**: 24px / 1.5rem - Section titles
- **Heading 3**: 20px / 1.25rem - Card titles
- **Body Large**: 18px / 1.125rem - Card content, questions
- **Body**: 16px / 1rem - Regular text
- **Body Small**: 14px / 0.875rem - Hints, metadata
- **Caption**: 12px / 0.75rem - Labels, tiny text

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasis
- **Semibold**: 600 - Headings, buttons
- **Bold**: 700 - Strong emphasis

---

## 📐 Layout & Spacing

### Container Widths
- **Mobile**: 100% with 16px padding
- **Tablet**: 720px max-width
- **Desktop**: 960px max-width for learning, 1200px for dashboard

### Spacing Scale (8px base)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Border Radius
- **Small**: 4px - Inputs, tags
- **Medium**: 8px - Buttons, small cards
- **Large**: 12px - Main cards
- **XLarge**: 16px - Modal dialogs

---

## 🖼️ Key Screens to Design

### 1. Learning Session Screen (PRIORITY)
**Layout**: Centered card design

**Components:**
- **Progress Bar** (top)
  - Width: Full width, 4px height
  - Color: Primary blue fill, light gray background
  - Shows: X/Y cards completed

- **Flashcard Container** (center)
  - Max-width: 600px on desktop, 90% on mobile
  - Background: White card with subtle shadow
  - Padding: 48px (desktop), 24px (mobile)
  - Border-radius: 12px
  - Shadow: 0 4px 12px rgba(0,0,0,0.08)

- **Question Area**
  - Font-size: 24px (desktop), 20px (mobile)
  - Text-align: center
  - Color: Text primary
  - Margin-bottom: 32px

- **Answer Options** (Multiple Choice)
  - 2-4 buttons stacked vertically
  - Height: 56px each
  - Spacing: 12px between
  - Border: 2px solid border-medium
  - Border-radius: 8px
  - Hover: Border changes to primary blue
  - Selected: Background primary blue, text white
  - Correct: Background success green
  - Wrong: Background error red with shake animation

- **Text Input Mode**
  - Input field: Height 56px, full width
  - Border: 2px solid border-medium
  - Focus: Border primary blue
  - Submit button below input

- **Action Buttons** (bottom)
  - Primary button: "Check Answer" / "Continue"
  - Secondary button: "Skip" (text button, no background)
  - Spacing: 16px between

**States:**
1. Question shown, waiting for answer
2. Answer selected, waiting for check
3. Correct answer feedback (green)
4. Wrong answer feedback (red, show correct answer)

---

### 2. Dashboard/Home Screen

**Layout**: Grid-based

**Components:**
- **Header**
  - Logo left
  - User profile right
  - Navigation menu (mobile: hamburger)

- **Stats Cards** (top section)
  - 3-4 cards in row (desktop), stacked (mobile)
  - Show: Daily streak, words learned, accuracy, time spent
  - Icon + number + label
  - Background: White cards

- **Deck List** (main section)
  - Card-based layout
  - Each deck shows:
    - Deck name
    - Progress bar
    - Cards to review count
    - "Start Learning" button
  - Grid: 2 columns (desktop), 1 column (mobile)

---

### 3. Deck Detail Screen

**Components:**
- Back button (top left)
- Deck title and description
- Progress visualization (circular or bar)
- Statistics: Total cards, mastered, learning, new
- "Start Session" button (prominent)
- Card list (optional, expandable)

---

### 4. Results/Completion Screen

**Layout**: Centered content

**Components:**
- Success icon/animation (top)
- "Session Complete!" heading
- Stats summary:
  - Cards reviewed
  - Accuracy percentage
  - Time spent
  - Streak status
- Action buttons:
  - "Continue Learning" (primary)
  - "Back to Dashboard" (secondary)

---

## 🧩 Component Library

### Buttons

**Primary Button**
- Background: Primary blue
- Text: White, semibold
- Height: 48px (desktop), 44px (mobile)
- Padding: 16px 32px
- Border-radius: 8px
- Hover: Darker blue
- Active: Scale 0.98
- Disabled: 50% opacity

**Secondary Button**
- Background: Transparent
- Border: 2px solid primary blue
- Text: Primary blue, semibold
- Same dimensions as primary

**Text Button**
- No background, no border
- Text: Primary blue or text secondary
- Underline on hover

### Input Fields

**Text Input**
- Height: 48px
- Padding: 12px 16px
- Border: 2px solid border-medium
- Border-radius: 8px
- Focus: Border primary blue, subtle shadow
- Error: Border error red
- Font-size: 16px

### Cards

**Standard Card**
- Background: White
- Border: 1px solid border-light
- Border-radius: 12px
- Padding: 24px
- Shadow: 0 2px 8px rgba(0,0,0,0.06)
- Hover: Shadow increases to 0 4px 12px rgba(0,0,0,0.1)

**Flashcard**
- Larger padding: 48px (desktop), 24px (mobile)
- Centered content
- Max-width: 600px
- Stronger shadow: 0 4px 12px rgba(0,0,0,0.08)

### Progress Bar

**Linear Progress**
- Height: 4px (thin) or 8px (thick)
- Background: Border-light
- Fill: Primary blue
- Border-radius: 4px
- Smooth animation on progress change

**Circular Progress**
- Stroke-width: 4px
- Background: Border-light
- Fill: Primary blue
- Center shows percentage

### Navigation

**Top Navigation Bar**
- Height: 64px
- Background: White
- Border-bottom: 1px solid border-light
- Logo: 32px height
- Links: Body size, medium weight
- Mobile: Hamburger menu icon

---

## 🎭 Interaction Patterns

### Answer Feedback
1. User selects answer → Button highlights
2. User clicks "Check" → Brief pause (200ms)
3. Correct: Green background, checkmark icon, success sound
4. Wrong: Red background, shake animation, show correct answer in green
5. "Continue" button appears after 1 second

### Card Transitions
- Fade out current card (300ms)
- Fade in next card (300ms)
- Progress bar animates smoothly

### Loading States
- Skeleton screens for card loading
- Spinner for data fetching
- Smooth transitions, no jarring changes

---

## ✨ Animations

### Micro-interactions
- **Button Hover**: Scale 1.02, transition 150ms
- **Button Click**: Scale 0.98, transition 100ms
- **Card Appear**: Fade in + slide up 20px, 300ms ease-out
- **Wrong Answer**: Shake horizontally 10px, 3 times, 400ms
- **Correct Answer**: Subtle bounce, 300ms
- **Progress Bar**: Smooth width transition, 500ms ease-out

### Page Transitions
- Fade between screens: 200ms
- Slide up for modals: 300ms ease-out

**Keep animations subtle** - Memrise style is smooth but not distracting

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- Stack all elements vertically
- Reduce padding: 48px → 24px
- Font sizes: Scale down 10-20%
- Touch targets: Minimum 44px height
- Full-width buttons
- Simplified navigation (hamburger menu)

### Tablet Adaptations
- 2-column grid for deck list
- Moderate padding
- Maintain card max-width

### Desktop
- Multi-column layouts
- Generous spacing
- Hover states active
- Keyboard navigation support

---

## 🎯 Figma Design Checklist

### Pages to Create
1. **🎨 Design System**
   - Color palette (all colors as styles)
   - Typography scale (all text styles)
   - Spacing scale (document in text)
   - Component library

2. **📱 Mobile Screens**
   - Learning session (all states)
   - Dashboard
   - Deck detail
   - Results screen

3. **💻 Desktop Screens**
   - Same screens as mobile, desktop layout

4. **🧩 Components Page**
   - All reusable components
   - All button variants
   - Input fields
   - Cards
   - Navigation
   - Progress indicators

### Figma Best Practices
- **Use Auto Layout**: For responsive components
- **Create Components**: For reusable elements (buttons, cards, inputs)
- **Use Variants**: For button states, card types
- **Color Styles**: Define all colors as styles
- **Text Styles**: Define all typography as styles
- **Constraints**: Set proper constraints for responsive behavior
- **Naming**: Clear, consistent naming (e.g., "Button/Primary/Default")

### Component Variants to Create

**Button Component**
- Variants: Primary, Secondary, Text
- States: Default, Hover, Active, Disabled

**Answer Option Component**
- States: Default, Hover, Selected, Correct, Wrong

**Card Component**
- Types: Standard, Flashcard, Stat Card
- States: Default, Hover

---

## 🎨 Visual References

### Memrise-Inspired Elements
1. **Centered Learning**: Card centered on page, generous margins
2. **Clean Progress**: Thin progress bar at top
3. **Bold Answers**: Large, tappable answer buttons
4. **Minimal Chrome**: Hide unnecessary UI during learning
5. **Friendly Feedback**: Positive reinforcement for correct answers
6. **White Space**: Don't crowd the interface

### What to Avoid
- ❌ Too many colors or gradients
- ❌ Cluttered interface with too much info
- ❌ Small touch targets
- ❌ Distracting animations
- ❌ Complex navigation during learning
- ❌ Dark patterns or aggressive gamification

---

## 📋 Design Priorities

### Phase 1 (MVP)
1. ✅ Learning session screen (all states)
2. ✅ Dashboard with deck list
3. ✅ Basic components (buttons, cards, inputs)
4. ✅ Mobile responsive

### Phase 2
- Deck detail screen
- Results/completion screen
- User profile
- Settings

### Phase 3
- Achievements/badges
- Social features
- Advanced statistics
- Themes/customization

---

## 💡 Tips for Designing in Figma

1. **Start with Mobile**: Design mobile first, then scale up
2. **Use 8px Grid**: Align everything to 8px grid for consistency
3. **Create Master Components**: Build component library before screens
4. **Use Real Content**: Use actual English words/phrases, not Lorem Ipsum
5. **Test Interactions**: Use Figma prototype to test user flow
6. **Get Feedback Early**: Share with users before building

---

## 🔗 Next Steps

After designing in Figma:
1. Share Figma file link
2. I'll implement the design into code
3. We'll iterate based on feedback

---

**Questions? Need clarification on any section? Let me know!**
