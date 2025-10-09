# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based CV builder and analyzer application that helps users create, manage, and optimize their resumes. The application integrates with AI services for CV analysis and scoring, supports PDF uploads, and provides real-time feedback on CV quality.

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based routing with type safety)
- **State Management**: Jotai (atomic state management)
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives + custom components
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios with custom interceptors

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (compiles TypeScript first, then builds)
npm run build

# Preview production build
npm run preview

# Linting
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix linting issues

# Code formatting
npm run format        # Format all files in src/
npm run format:check  # Check formatting without modifying
```

## Architecture

### Directory Structure

```
src/
├── config/           # App configuration and environment variables
├── modules/          # Feature modules (auth, cv, education, experience, etc.)
│   ├── auth/         # Authentication & authorization
│   ├── cv/           # CV management and AI analysis
│   ├── payment/      # Payment, billing, and package management
│   ├── certification/
│   ├── contact/
│   ├── education/
│   ├── experience/
│   ├── project/
│   ├── skill/
│   └── summary/
├── routes/           # TanStack Router file-based routes
│   ├── __root.tsx    # Root layout
│   ├── _auth/        # Public auth routes (login, register)
│   ├── _private/     # Protected routes (dashboard)
│   └── _public.tsx   # Public routes (landing page)
├── shared/           # Shared utilities, components, types
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── types/        # Shared TypeScript types
│   └── constants/    # App-wide constants
└── styles/           # Global CSS and Tailwind config
```

### Module Structure

Each feature module follows a consistent structure:

```
module-name/
├── components/       # Module-specific components
├── hooks/            # React Query hooks and custom hooks
├── services/         # API service functions
├── types/            # TypeScript type definitions
├── constants/        # Module constants (endpoints, enums)
├── stores/           # Jotai atoms (if needed)
└── index.ts          # Public exports
```

### Routing System

This project uses **TanStack Router** with file-based routing:

- Routes are defined in `src/routes/` directory
- Route files follow the pattern: `filename.tsx` or `_layout.tsx`
- Layouts use underscore prefix: `_auth.tsx`, `_private.tsx`
- Dynamic routes use `$param` syntax: `cvs/$cvId.tsx`
- Route tree is auto-generated in `src/routeTree.gen.ts`

**Route Guards:**
- `_auth.tsx`: Redirects authenticated users to dashboard
- `_private.tsx`: Redirects unauthenticated users to login
- Route context provides `auth` and `notification` utilities

### State Management

**Jotai** is used for global state (lightweight atomic state):
- Auth store: `src/modules/auth/stores/auth.store.tsx`
- CV analysis store: `src/modules/cv/stores/analyze.store.ts`

**TanStack Query** handles server state:
- Queries and mutations defined in module `hooks/` directories
- Query client configured in `src/config/tanstack-query.config.ts`
- Default config: no window refocus, no retries

### HTTP Clients

Three Axios clients with different purposes:

1. **`baseClient`** (`src/shared/utils/api-client.util.ts`)
   - Basic client without auth
   - Used for public endpoints

2. **`authClient`** (`src/modules/auth/services/client.service.ts`)
   - Automatically attaches JWT access tokens
   - Handles 401 responses with token refresh
   - Implements token refresh synchronization (prevents multiple refresh calls)
   - Used for protected API endpoints

3. **`aiClient`** (`src/shared/utils/ai-client.util.ts`)
   - Dedicated client for AI analysis service
   - Configured with `VITE_AI_API_ENDPOINT`

**Token Refresh Mechanism:**
- When a 401 occurs, the first request triggers token refresh
- Subsequent concurrent 401s wait for the same refresh promise
- On refresh success: all requests retry with new token
- On refresh failure: all requests fail and user is logged out

### Authentication Flow

1. **Login**: User authenticates via credentials or OAuth2 providers
2. **Token Storage**: Access token in memory, refresh token in HTTP-only cookies
3. **Auto-refresh**: Tokens automatically refresh on 401 responses
4. **Session Expiry**: Calls `handleSessionExpired()` which clears state and redirects
5. **Auth Initialization**: `useAuthInit` hook loads user on app start

**Key files:**
- `src/modules/auth/hooks/useAuth.tsx` - Main auth hook
- `src/modules/auth/services/auth.service.ts` - Auth API calls
- `src/modules/auth/services/access-token-storage.service.ts` - Token management
- `src/modules/auth/stores/auth.store.tsx` - User state

### CV Analysis System

The CV analysis feature is a complex async workflow:

1. **Start Analysis**: `POST /api/analyze` - Returns job ID
2. **Poll Status**: Check analysis status with job ID
3. **Get Feedback**: Once complete, fetch detailed analysis results
4. **Apply Suggestions**: Mark suggestions as applied

**Key files:**
- `src/modules/cv/hooks/useAnalysis.ts` - Analysis mutations and queries
- `src/modules/cv/services/analysis.service.ts` - AI API calls
- `src/modules/cv/utils/job-response.util.ts` - Job response handling
- `src/modules/cv/worker/analysis-feedback.worker.ts` - Web worker for polling

**Analysis Response Pattern:**
- Analysis endpoints return job responses with `status` field
- Use `handleJobResponse()` utility to handle job status consistently
- Supports polling for long-running AI operations

### Payment & Billing System

The payment system integrates with PayOS for secure payment processing:

1. **View Packages**: User browses available subscription packages on `/dashboard/pricing`
2. **Create Payment**: User selects package → Creates payment link via PayOS API
3. **Complete Payment**: User redirected to PayOS → Completes payment
4. **Status Tracking**: App polls payment status → Updates on completion
5. **Billing History**: Users can view all transactions on `/dashboard/billing`

**Payment Flow:**
- User clicks "Get Started" on a package card
- `useCreatePayment` mutation creates payment link
- PaymentModal displays QR code and checkout URL
- Payment status page polls for completion (auto-refresh every 5 seconds)
- On success, billing history is updated automatically

**Key files:**
- `src/modules/payment/hooks/usePayment.tsx` - Payment mutations and queries
- `src/modules/payment/hooks/usePackage.tsx` - Package listing hooks
- `src/modules/payment/hooks/useBilling.tsx` - Billing history hooks
- `src/modules/payment/services/payment.service.ts` - Payment API calls
- `src/modules/payment/components/PackageCard.tsx` - Package display component
- `src/modules/payment/components/PaymentModal.tsx` - Payment QR/checkout modal
- `src/routes/_private/dashboard/pricing.tsx` - Pricing page
- `src/routes/_private/dashboard/billing.tsx` - Billing history page
- `src/routes/_private/dashboard/payment-status.tsx` - Payment status tracker

**Payment Status Polling:**
- `usePaymentStatus` hook automatically polls every 5 seconds for PENDING payments
- Stops polling when status changes to PAID, CANCELLED, or EXPIRED
- Payment status page auto-refreshes UI based on polling results

**Important Notes:**
- Payment endpoints use `authClient` (requires authentication)
- Package endpoints use `baseClient` (public access)
- All currency amounts are in VND (Vietnamese Dong)
- Payment webhooks are handled by backend, not frontend

### Environment Variables

Configure in `.env` file (see `.env` for current values):

```bash
VITE_API_ENDPOINT=          # Main API URL
VITE_AI_API_ENDPOINT=       # AI service URL
VITE_API_ICON_ENDPOINT=     # Icons API URL
```

**Important**: Only variables prefixed with `VITE_` are exposed to the client (Vite security feature).

### Path Aliases

Use `@/` for absolute imports from `src/`:

```typescript
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
```

Configured in:
- `vite.config.ts` - Build-time resolution
- `tsconfig.json` - TypeScript resolution

### Form Handling

Forms use **React Hook Form** + **Zod** validation:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ /* ... */ })
const form = useForm({ resolver: zodResolver(schema) })
```

Form components in `src/shared/components/ui/form.tsx` provide consistent styling.

### UI Components

- **Base components**: Radix UI primitives in `src/shared/components/ui/`
- **Module components**: Feature-specific components in module directories
- **Styling**: Tailwind CSS with custom utility classes
- **Class merging**: Use `cn()` utility (`src/shared/utils/cn.util.ts`) for conditional classes

### Notifications

Use the `useNotification` hook for toast messages:

```typescript
const { showSuccess, showError } = useNotification()

showSuccess('Operation completed!')
showError('Something went wrong')
```

Implemented with **Sonner** toast library.

### Type Safety

- **Strict mode enabled** in TypeScript
- API responses have defined types in module `types/` directories
- Route context is type-safe via TanStack Router
- Form validation enforced via Zod schemas

### CV Data Flow

1. **Create CV**: User uploads PDF or fills form → Creates CV record
2. **Structure CV**: Backend extracts/structures CV data into sections
3. **Edit CV**: User modifies sections (contact, experience, education, etc.)
4. **Analyze CV**: Submit for AI analysis with job description
5. **View Feedback**: Display analysis results and suggestions
6. **Apply Suggestions**: Update CV based on recommendations

**CV Sections:**
- Contact (phone, email, LinkedIn, GitHub, location)
- Summary (professional summary)
- Experiences (job title, company, dates, description)
- Education (degree, institution, dates, GPA)
- Projects (title, description, dates, links)
- Skills (categorized skill list)
- Certifications (name, organization, issued date)

### Code Style Conventions

- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **File naming**: kebab-case for files, PascalCase for component files
- **Exports**: Named exports preferred over default exports
- **Constants**: UPPER_SNAKE_CASE in `constants/` files
- **Types**: Define in module `types/` files, suffix with type/interface name

### Common Patterns

**React Query Hook:**
```typescript
export const useFeature = () => {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => getFeature(id),
    enabled: !!id,
  })
}
```

**Mutation Hook:**
```typescript
export const useUpdateFeature = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotification()

  return useMutation({
    mutationFn: (data) => updateFeature(data),
    onSuccess: () => {
      showSuccess('Updated!')
      queryClient.invalidateQueries({ queryKey: ['feature'] })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      showError(error?.response?.data?.message || 'Failed')
    },
  })
}
```

**Service Function:**
```typescript
export const getFeature = async (id: string) => {
  const { data } = await authClient<FeatureResponse>({
    method: 'GET',
    url: FEATURE_ENDPOINT(id),
  })
  return data
}
```

## Testing

No test framework is currently configured. Tests would need to be set up with a testing library like Vitest or Jest.

## Important Notes

- **Token refresh is synchronized** - Multiple concurrent 401 responses share one refresh call
- **Route files are auto-generated** - Don't manually edit `routeTree.gen.ts`
- **Environment variables must start with `VITE_`** to be accessible in client code
- **TanStack Query defaults** - No automatic refetch on window focus, no retries
- **Job response pattern** - AI operations return job IDs, poll for completion
