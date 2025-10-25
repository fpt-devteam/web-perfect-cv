# Payment Module Implementation Guide

This document provides a comprehensive guide to the payment module implementation in the Perfect CV frontend application.'


## Overview

The payment module provides complete integration with PayOS payment gateway, including:
- Package listing and selection
- Payment link creation
- Real-time payment status tracking
- Billing history management
- Automatic status polling

## Architecture

### Module Structure

```
src/modules/payment/
├── components/
│   ├── PackageCard.tsx           # Display individual package with features
│   ├── PaymentModal.tsx          # Payment QR code and checkout modal
│   ├── BillingHistoryTable.tsx   # Transaction history table
│   └── index.ts
├── hooks/
│   ├── usePayment.tsx            # Payment operations (create, status, cancel)
│   ├── usePackage.tsx            # Package listing and details
│   ├── useBilling.tsx            # Billing history operations
│   └── index.ts
├── services/
│   ├── payment.service.ts        # Payment API calls
│   ├── package.service.ts        # Package API calls
│   └── billing.service.ts        # Billing API calls
├── types/
│   └── payment.types.ts          # TypeScript definitions
├── constants/
│   └── payment-endpoint.constant.ts  # API endpoints
└── index.ts
```

### Routes

Three new routes have been added:

1. **`/dashboard/pricing`** - Package selection and purchase
2. **`/dashboard/billing`** - Transaction history
3. **`/dashboard/payment-status`** - Payment status tracking with polling

## User Flow

### 1. Viewing Packages

Users can access the pricing page by:
- Clicking the "UPGRADE" button in the dashboard header
- Clicking "Upgrade" in the user profile dropdown menu
- Navigating to `/dashboard/pricing` directly

The pricing page displays all active packages sorted by `displayOrder`, with features and pricing clearly shown.

### 2. Initiating Payment

When a user clicks "Get Started" on a package:

1. `useCreatePayment` mutation is called with the package ID
2. Backend creates a PayOS payment link
3. Response includes:
   - Checkout URL (for web browser payment)
   - QR code (for mobile banking app)
   - Order code (for tracking)
   - Payment amount and description

4. `PaymentModal` component opens and displays:
   - QR code for scanning
   - Order code with copy button
   - "Open Payment Page" button
   - Payment details

### 3. Completing Payment

Users have two options:

**Option A: Web Payment**
- Click "Open Payment Page" button
- Redirected to PayOS in new tab
- Complete payment on PayOS platform
- PayOS handles return redirect

**Option B: Mobile Banking**
- Scan QR code with banking app
- Complete payment in banking app
- No redirect needed

### 4. Status Tracking

After payment initiation, users can:

1. Navigate to `/dashboard/payment-status?orderCode=123456789`
2. The page automatically polls every 5 seconds for PENDING payments
3. Status updates automatically when payment completes
4. Users can:
   - Refresh status manually
   - Cancel pending payments
   - Return to dashboard (if paid)
   - Try again (if cancelled/expired)

### 5. Viewing History

Users can view their transaction history at `/dashboard/billing`:

- Summary cards showing:
  - Total spent
  - Total transactions
  - Successful payments
- Complete transaction table with:
  - Date and time
  - Package name
  - Order code
  - Amount
  - Payment method
  - Status badge
  - Action buttons (view details, download invoice)

## Technical Implementation

### React Query Hooks

#### Payment Hooks

```typescript
// Create payment link
const { mutateAsync, isPending } = useCreatePayment();
await mutateAsync({ packageId: 'uuid' });

// Get payment status (with auto-polling)
const { data: status } = usePaymentStatus(orderCode, enabled);
// Polls every 5 seconds if status is PENDING

// Get full payment info
const { data: paymentInfo } = usePaymentInfo(orderCode, enabled);

// Cancel payment
const { mutateAsync } = useCancelPayment();
await mutateAsync({
  orderCode,
  request: { cancellationReason: 'User requested' }
});
```

#### Package Hooks

```typescript
// Get all active packages (public endpoint)
const { data: packages } = useActivePackages();

// Get package by ID
const { data: package } = usePackageById(id, enabled);

// Get package by name
const { data: package } = usePackageByName('Premium', enabled);
```

#### Billing Hooks

```typescript
// Get user's billing history
const { data: history } = useBillingHistory(userId, enabled);

// Get specific billing record
const { data: record } = useBillingHistoryById(id, enabled);
```

### HTTP Clients

The payment module uses different clients based on authentication requirements:

- **`authClient`** - For payment operations (requires auth)
  - Create payment
  - Get payment status
  - Cancel payment
  - Get billing history

- **`baseClient`** - For public package endpoints
  - List active packages
  - Get package details

### Auto-Polling Mechanism

The `usePaymentStatus` hook implements smart polling:

```typescript
refetchInterval: (query) => {
  const status = query.state.data?.status;
  // Poll every 5 seconds if status is PENDING
  return status === 'PENDING' ? 5000 : false;
}
```

This automatically:
- Polls every 5 seconds when payment is pending
- Stops polling when status changes to PAID, CANCELLED, or EXPIRED
- Prevents unnecessary API calls

### Payment Status Flow

```
User clicks "Get Started"
         ↓
Create payment link (POST /api/payment/create-payment)
         ↓
Display PaymentModal with QR & checkout URL
         ↓
User completes payment on PayOS
         ↓
Backend webhook receives payment confirmation
         ↓
Frontend polls status (GET /api/payment/status/:orderCode)
         ↓
Status updates from PENDING → PAID
         ↓
Billing history automatically updated
         ↓
User sees success message
```

## UI Components

### PackageCard

Displays a single package with:
- Name and description
- Price (formatted for VND currency)
- Duration
- Feature list with checkmarks
- "Get Started" button
- "Popular" badge (optional)
- Hover effects and responsive design

### PaymentModal

Shows payment details with:
- QR code for mobile scanning
- Order code with copy functionality
- Amount and description
- "Open Payment Page" button (opens PayOS in new tab)
- Cancel button

### BillingHistoryTable

Displays transaction history with:
- Sortable columns
- Status badges with color coding
- Action buttons (view details, download)
- Empty state message
- Responsive design

## API Integration

All API endpoints are defined in `payment-endpoint.constant.ts`:

```typescript
// Payment endpoints (require auth)
POST   /api/payment/create-payment
GET    /api/payment/payment-info/:orderCode
GET    /api/payment/status/:orderCode
POST   /api/payment/payment/:orderCode/cancel

// Package endpoints (public)
GET    /api/packages/active
GET    /api/packages/:id
GET    /api/packages/by-name/:name

// Billing endpoints (require auth)
GET    /api/billing-histories/user/:userId
GET    /api/billing-histories/:id
```

## Navigation Updates

The following UI elements have been updated to support payment navigation:

### Dashboard Header
- **UPGRADE button** - Navigates to `/dashboard/pricing`
- **User dropdown menu** - Added "Billing History" option

### Sidebar
- Already includes "Premium Features" and "Billing" links
- Now properly routed to pricing and billing pages

## Error Handling

All hooks include comprehensive error handling:

```typescript
onError: (error: AxiosError<{ message?: string }>) => {
  showError(error?.response?.data?.message || 'Default error message');
}
```

Error states are displayed using:
- Toast notifications (via Sonner)
- Alert components (for critical errors)
- Empty states (for no data)

## Payment Status Values

```typescript
type PaymentStatus =
  | 'PENDING'   // Payment initiated, awaiting confirmation
  | 'PAID'      // Payment completed successfully
  | 'CANCELLED' // Payment cancelled by user or system
  | 'EXPIRED'   // Payment link expired
```

## Currency Formatting

VND currency is formatted using Intl.NumberFormat:

```typescript
const formatPrice = (price: number, currency: string) => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }
  return `${currency} ${price.toLocaleString()}`;
};
```

## Testing Considerations

When testing the payment module:

1. **Package Listing**
   - Verify active packages load correctly
   - Check package sorting by displayOrder
   - Validate feature list display

2. **Payment Creation**
   - Test with valid and invalid package IDs
   - Verify QR code and checkout URL generation
   - Check error handling for failed payment creation

3. **Status Polling**
   - Verify polling starts automatically for PENDING payments
   - Check polling stops after status change
   - Test manual refresh functionality

4. **Payment Cancellation**
   - Verify cancel button only shows for PENDING payments
   - Test confirmation dialog flow
   - Check status updates after cancellation

5. **Billing History**
   - Verify transaction list loads correctly
   - Check status badge colors
   - Test empty state display

## Security Considerations

1. **Authentication**
   - All payment operations require authentication
   - Token refresh mechanism handles expired tokens
   - Package listing is public (no auth required)

2. **Payment Validation**
   - Backend validates all payment requests
   - Amount verification happens server-side
   - PayOS handles secure payment processing

3. **Webhook Security**
   - Payment webhooks are verified by backend
   - Frontend only displays results, never processes payments directly

## Future Enhancements

Potential improvements for the payment module:

1. **Invoice Generation**
   - Download PDF invoices
   - Email invoices automatically

2. **Payment Method Selection**
   - Support multiple payment gateways
   - Save preferred payment method

3. **Subscription Management**
   - Auto-renewal settings
   - Cancellation scheduling
   - Usage tracking

4. **Analytics**
   - Payment success rate tracking
   - Popular package analysis
   - Revenue dashboards

## Troubleshooting

### Common Issues

**Routes not working:**
- Run `npm run dev` to regenerate route tree
- Check `src/routeTree.gen.ts` is updated

**TypeScript errors:**
- Ensure all types are properly exported
- Check import paths use `@/` alias correctly

**Polling not stopping:**
- Verify `refetchInterval` logic in `usePaymentStatus`
- Check that status changes are detected correctly

**Payment modal not closing:**
- Verify `onClose` prop is passed correctly
- Check state management in parent component

## Related Documentation

- [Payment API Documentation](./PAYMENT_API_DOCUMENTATION.md) - Backend API specs
- [CLAUDE.md](../CLAUDE.md) - Project architecture and conventions

## Support

For questions or issues with the payment module:
- Check the API documentation first
- Review error messages in the console
- Verify network requests in browser DevTools
- Contact backend team for API-related issues
