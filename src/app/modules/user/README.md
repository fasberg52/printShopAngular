# User Module

This module contains the user-facing interface for the print shop application with full RTL (Right-to-Left) support and Persian language localization.

## Structure

```
user/
├── auth/                           # User authentication pages
│   ├── pages/
│   │   ├── login/                  # User login component
│   │   ├── register/               # User registration component (placeholder)
│   │   └── forgot-password/        # Password recovery component (placeholder)
│   └── user-auth.routes.ts         # Authentication routing
├── dashboard/                      # Main user dashboard
├── orders/                         # Order management pages
├── addresses/                      # Address management pages
├── transactions/                   # Transaction history pages
├── user.routes.ts                  # Main user routing configuration
└── README.md                       # This file
```

## Guards

- `userGuard`: Protects routes that require user authentication
- `userPublicGuard`: Prevents authenticated users from accessing auth pages

## Features

- RTL layout support
- Persian language interface
- Vazir Matn font integration
- PrimeNG component integration
- Responsive design
- Form validation with Persian error messages

## Routes

- `/user/auth/login` - User login page
- `/user/auth/register` - User registration page (placeholder)
- `/user/auth/forgot-password` - Password recovery page (placeholder)
- `/user/dashboard` - Main user dashboard (placeholder)
- `/user/orders` - Order management (placeholder)
- `/user/addresses` - Address management (placeholder)
- `/user/transactions` - Transaction history (placeholder)

## Next Steps

The following components are placeholders and will be implemented in subsequent tasks:

- User registration form with Persian validation
- Password recovery with OTP verification
- Dashboard with pricing and orders display
- Order management interface
- Address management
- Transaction history
