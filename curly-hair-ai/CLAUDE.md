# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

This is a Next.js 15.4.4 application using the App Router pattern with the following stack:

### Core Technologies
- **Next.js 15.4.4** with App Router and React 19
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **Anthropic AI SDK** for AI integration
- **Supabase** for backend services (auth, database)

### Key Dependencies
- `@supabase/supabase-js` and `@supabase/ssr` for database and authentication
- `@anthropic-ai/sdk` for AI functionality  
- `@headlessui/react` for accessible UI components
- `lucide-react` for icons
- `react-dropzone` for file uploads
- `browser-image-compression` for image processing
- `class-variance-authority` and `clsx` for conditional styling

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/app/globals.css` - Global styles with Tailwind CSS and custom CSS variables
- TypeScript path aliases configured: `@/*`, `@/components/*`, `@/lib/*`, `@/types/*`

### Configuration Files
- `next.config.ts` - Next.js configuration with Turbopack optimizations and Supabase image domains
- `tsconfig.json` - TypeScript configuration with strict mode and path mapping
- `eslint.config.mjs` - ESLint configuration extending Next.js recommended rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4

### Styling System
- Uses Tailwind CSS v4 with custom CSS variables for theming
- Dark mode support via `prefers-color-scheme`
- Geist font family integration (sans and mono variants)
- Custom color tokens: `--background`, `--foreground`

### Development Notes
- Project uses Turbopack for faster development builds
- Optimized package imports for `lucide-react` and `@headlessui/react`
- External packages configuration for server components includes `@anthropic-ai/sdk`
- Console statements removed in production builds


# Claude.md - TONIGHT LAUNCH: Curly Hair AI

**DEADLINE**: Launch TONIGHT to curly-hair-ai.com  
**MISSION**: Ship a working AI curly hair expert in 8 hours  
**STACK**: Next.js + Anthropic Claude + Vercel deployment  

## 🚀 TONIGHT'S BATTLE PLAN (8 Hours)

### Hour 1-2: Foundation Setup
```bash
# Quick project setup
npx create-next-app@latest curly-hair-ai --typescript --tailwind --app
cd curly-hair-ai
npm install @anthropic-ai/sdk lucide-react framer-motion sharp
```

### Hour 3-4: Core Image Analysis
### Hour 5-6: Results Interface + User Refinement
### Hour 7-8: Polish + Deploy

---

## 🎯 CORE FEATURES (Ship Tonight)

### 1. Multi-Angle Photo Capture
- **Required**: Front, Back, Top, Close-up
- **Validation**: AI-powered photo quality check
- **UX**: Guided capture with visual examples

### 2. Claude AI Hair Analysis
- **Engine**: Anthropic Claude 3.5 Sonnet
- **Input**: 4 photos + structured analysis prompt
- **Output**: Comprehensive hair assessment

### 3. Interactive Confidence Refinement
- **Low Confidence Items**: User selects from visual options
- **Attributes**: Porosity, curl type, frizz, thinning, damage
- **Method**: Image selection + text confirmation

### 4. Personalized Routine + Sources
- **AI-Generated**: Custom routine based on analysis
- **Cross-Referenced**: Real sources and scientific backing
- **Focus**: Top 3 pain points with solutions

---

## 🛠️ TECH STACK (Optimized for Speed)

```typescript
// Core Dependencies
"@anthropic-ai/sdk": "^0.24.0",
"next": "15.0.0",
"framer-motion": "^11.0.0",
"lucide-react": "^0.400.0",
"sharp": "^0.32.0"
```

### Why This Stack
- **Next.js 15**: Zero config, instant deploy
- **Anthropic Claude**: Best vision model, reliable API
- **Framer Motion**: Smooth animations out of the box
- **Vercel**: Deploy in 30 seconds
- **No Database**: Store in sessionStorage for tonight

---

## 🎨 UI/UX BLUEPRINT

### Landing Page
```
Hero: "Get Your Complete Curly Hair Analysis"
↓
4-Step Photo Guide with Examples
↓
"Start Analysis" Button
```

### Photo Capture Flow
```
Step 1: Front View → Step 2: Back View → Step 3: Top View → Step 4: Close-up
Each with:
- Visual guide overlay
- Quality validation
- Retake option
```

### Results Page (STUNNING)
```
Loading Animation (Hair growing/curling)
↓
Analysis Results with Animated Reveals:
- Curl Pattern (Visual curl comparison)
- Porosity Test (Water droplet animation)
- Health Score (Animated gauge)
- Density (Hair strand visualization)
↓
Confidence Refinement (Interactive selections)
↓
Custom Routine (Step-by-step with sources)
```

---

## 🤖 CLAUDE AI PROMPTS (Optimized)

### Master Analysis Prompt
```
You are the world's leading curly hair expert analyzing 4 photos of someone's hair:
- Front view: [IMAGE]
- Back view: [IMAGE] 
- Top view: [IMAGE]
- Close-up: [IMAGE]

Provide a detailed analysis in this EXACT JSON format:

{
  "curlPattern": {
    "assessment": "3B",
    "confidence": 0.85,
    "evidence": "Clear spiral curls with defined ringlets",
    "alternatives": ["3A", "3C"]
  },
  "porosity": {
    "assessment": "High",
    "confidence": 0.65,
    "evidence": "Hair appears dry with visible cuticle damage",
    "testSuggestions": ["Float test", "Spray bottle test"]
  },
  "density": {
    "assessment": "Medium",
    "confidence": 0.90,
    "evidence": "Moderate hair coverage, scalp barely visible"
  },
  "healthScore": {
    "score": 6,
    "confidence": 0.80,
    "factors": ["Some frizz", "Moderate shine", "Defined curl pattern"]
  },
  "specificIssues": [
    {
      "issue": "Frizz",
      "severity": "Moderate",
      "confidence": 0.75,
      "evidence": "Flyaways visible in front and top views"
    },
    {
      "issue": "Dryness",
      "severity": "High", 
      "confidence": 0.80,
      "evidence": "Matte appearance, lack of shine"
    }
  ],
  "topPainPoints": [
    "Managing frizz in humidity",
    "Maintaining curl definition",
    "Reducing dryness and brittleness"
  ]
}

Be specific, encouraging, and focus on actionable insights.
```

### Routine Generation Prompt
```
Based on this hair analysis: [ANALYSIS_RESULTS]

Create a comprehensive curly hair routine addressing their top 3 pain points:
1. [Pain Point 1]
2. [Pain Point 2] 
3. [Pain Point 3]

Format as JSON:
{
  "routine": {
    "washDay": {
      "frequency": "2-3 times per week",
      "steps": [
        {
          "step": "Pre-poo treatment",
          "product": "Oil-based treatment",
          "why": "Protects hair from harsh cleansing",
          "source": "Trichology Journal 2023"
        }
      ]
    },
    "daily": {
      "steps": [...]
    },
    "weekly": {
      "steps": [...]
    }
  },
  "productCategories": [
    {
      "category": "Leave-in Conditioner",
      "why": "Provides moisture for high porosity hair",
      "ingredients": ["Glycerin", "Ceramides"],
      "source": "International Journal of Cosmetic Science"
    }
  ],
  "techniques": [
    {
      "name": "Plopping",
      "description": "Wrap wet curls in microfiber towel",
      "benefit": "Reduces frizz and enhances curl formation",
      "source": "Curly Hair Science, Dr. Sarah Johnson"
    }
  ]
}

Include real sources and scientific backing for each recommendation.
```

---

## 📱 COMPONENT ARCHITECTURE

### File Structure
```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── capture/
│   │   └── page.tsx          # Photo capture flow
│   ├── analysis/
│   │   └── page.tsx          # Results + refinement
│   └── api/
│       ├── analyze/
│       │   └── route.ts      # Claude analysis
│       └── routine/
│           └── route.ts      # Generate routine
├── components/
│   ├── PhotoCapture.tsx      # 4-step capture
│   ├── ResultsDisplay.tsx    # Animated results
│   ├── ConfidenceRefiner.tsx # User refinement
│   └── RoutineDisplay.tsx    # Final routine
└── lib/
    ├── anthropic.ts          # Claude client
    ├── image-processing.ts   # Sharp utilities
    └── types.ts              # TypeScript definitions
```

### Key Components

#### PhotoCapture.tsx
```typescript
const steps = [
  {
    id: 'front',
    title: 'Front View',
    instruction: 'Face the camera, hair down and natural',
    example: '/examples/front.jpg',
    validation: 'Face clearly visible, full hair shown'
  },
  {
    id: 'back', 
    title: 'Back View',
    instruction: 'Turn around, show the back of your hair',
    example: '/examples/back.jpg',
    validation: 'Back of head clearly visible'
  },
  {
    id: 'top',
    title: 'Top View', 
    instruction: 'Looking down, show crown and part',
    example: '/examples/top.jpg',
    validation: 'Crown and hair density visible'
  },
  {
    id: 'closeup',
    title: 'Close-up',
    instruction: 'Close shot of curl pattern and texture',
    example: '/examples/closeup.jpg', 
    validation: 'Individual curls and texture clear'
  }
];
```

#### ResultsDisplay.tsx
```typescript
const ResultsDisplay = ({ analysis }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <CurlPatternCard />
      <PorosityCard />
      <HealthScoreGauge />
      <IssuesBreakdown />
    </motion.div>
  );
};
```

---

## 🎨 VISUAL DESIGN SYSTEM

### Color Palette
```css
:root {
  --primary: #8B4513;     /* Saddle Brown */
  --secondary: #DEB887;   /* Burlywood */
  --accent: #F4A460;      /* Sandy Brown */
  --success: #228B22;     /* Forest Green */
  --warning: #FF8C00;     /* Dark Orange */
  --background: #FFF8DC;  /* Cornsilk */
  --text: #2F4F4F;        /* Dark Slate Gray */
}
```

### Animation Library
```typescript
// Smooth reveals
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Curl animation
const curlGrow = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 2, ease: "easeInOut" }
};
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Environment Variables
```bash
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=https://curly-hair-ai.com
```

### Vercel Deployment
```bash
# Deploy to Vercel
npx vercel --prod

# Custom domain setup
vercel domains add curly-hair-ai.com
vercel domains ls
```

### Domain Configuration
1. Point curly-hair-ai.com to Vercel
2. SSL certificate (automatic via Vercel)
3. Performance monitoring enabled

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### Image Handling
```typescript
// Compress images before analysis
const processImage = async (file: File) => {
  const compressed = await sharp(await file.arrayBuffer())
    .resize(1024, 1024, { fit: 'inside' })
    .jpeg({ quality: 85 })
    .toBuffer();
  
  return compressed;
};
```

### Loading States
```typescript
const LoadingAnimation = () => (
  <div className='flex flex-col items-center justify-center text-center'>
      <motion.svg
        width='80'
        height='80'
        viewBox='0 0 80 80'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        className='mb-8'
      >
        <motion.path
          d='M 20 60 Q 40 20 60 60 Q 70 75 40 75 Q 10 75 20 60'
          stroke='var(--primary, #8B4513)'
          strokeWidth='4'
          strokeLinecap='round'
          fill='none'
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.circle
          cx='40'
          cy='75'
          r='4'
          fill='var(--primary, #8B4513)'
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </motion.svg>
      <motion.h2
        className='text-2xl font-bold text-primary mb-2'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Analyzing your beautiful curls...
      </motion.h2>
      <motion.p
        className='text-secondary max-w-xs mx-auto'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Our AI expert is examining your hair photos to create your personalized analysis
      </motion.p>
      <span className='sr-only'>Loading, please wait...</span>
    </div>
);
```

---

## 📊 LAUNCH METRICS (Track Tonight)

### Success Indicators
- [ ] Site loads in < 2s
- [ ] Analysis completes in < 10s
- [ ] Mobile responsive (iPhone/Android)
- [ ] At least 5 test analyses completed
- [ ] All photo validations working
- [ ] Routine generation functional

### Analytics (Simple)
```typescript
// Track key events
const trackEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined') {
    console.log(`Event: ${event}`, data);
    // Add Vercel Analytics later
  }
};
```

---

## 🎯 TONIGHT'S SUCCESS DEFINITION

**SHIPPED**: Working curly hair AI expert live on curly-hair-ai.com

**CORE FLOW WORKING**:
1. ✅ User uploads 4 hair photos
2. ✅ Claude AI analyzes and provides assessment
3. ✅ User refines low-confidence results
4. ✅ Receives personalized routine with sources
5. ✅ Beautiful, animated results page

**QUALITY STANDARDS**:
- Mobile-first responsive design
- Smooth animations and micro-interactions
- Professional, trustworthy appearance
- Fast loading and analysis times
- Error handling for edge cases

---

## 🔥 EXECUTION COMMANDS

### Setup (5 minutes)
```bash
npx create-next-app@latest curly-hair-ai --typescript --tailwind --app
cd curly-hair-ai
npm install @anthropic-ai/sdk lucide-react framer-motion sharp
```

### Environment
```bash
echo "ANTHROPIC_API_KEY=your_key" > .env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

### Deploy
```bash
npm run build
npx vercel --prod
```

---

**TONIGHT WE SHIP. NO EXCUSES. NO PERFECT CODE. JUST WORKING AI THAT HELPS PEOPLE WITH THEIR CURLY HAIR.**

**GO TIME** 🚀🔥