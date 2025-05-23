# mPOS (Mobile Point of Sale) Database Schema

This document describes the database schema for the mPOS system, a comprehensive point-of-sale solution designed for modern businesses.

## Core Entities

### Organization
The central entity that represents a business using the mPOS system. Each organization can:
- Manage multiple users with different roles
- Configure taxes, discounts, and loyalty programs
- Customize receipt formats
- Track sales and customer data

### User
Represents individuals who can access the system. Users can:
- Be associated with multiple organizations
- Have different roles (Admin, Cashier) in each organization
- Process sales and manage transactions
- Access organization-specific features based on their role

### Product & Category
Products are items that can be sold through the POS system:
- Organized into categories for easy management
- Track cost and selling prices
- Support barcode scanning
- Can have multiple discounts applied

## Sales & Transactions

### Invoice
Represents a complete sales transaction:
- Contains multiple invoice items
- Tracks total amount, discounts, and taxes
- Links to customer and cashier
- Supports multiple payments

### Payment
Records financial transactions:
- Supports multiple payment methods
- Tracks expected and actual payment amounts
- Links to invoices and customers
- Records the cashier who processed the payment

## Customer Management

### Customer
Stores information about buyers:
- Tracks purchase history
- Manages loyalty points
- Handles customer dues
- Links to invoices and payments

### CustomerFeedback
Captures customer satisfaction data:
- Records ratings and feedback
- Helps improve service quality
- Links feedback to specific organizations

## Business Features

### Loyalty Program
Configures customer reward systems:
- Define points earning rates
- Set point-to-discount conversion rates
- Configure points expiry
- Set organization-specific rules

### Tax Configuration
Manages tax rules:
- Define different tax rates
- Set default tax configurations
- Organization-specific tax rules

### Discount Management
Handles promotional offers:
- Time-bound discounts
- Product-specific promotions
- Organization-level discount rules

### Receipt Customization
Allows organizations to customize receipt formats:
- Configure display options
- Set custom thank you notes
- Control information visibility
- Support multiple languages

## Relationships Overview

- Organizations ←→ Users (many-to-many through OrganizationUser)
- Products → Categories (many-to-one)
- Invoices → Customers (many-to-one)
- Invoices → Products (many-to-many through InvoiceItem)
- Payments → Invoices (many-to-one)
- All main entities → Organizations (many-to-one)

## Security & Access Control

The system implements role-based access control through the UserRole enum:
- ADMIN: Full access to organization settings and reports
- CASHIER: Limited to sales and basic operations

## Database Conventions

- All IDs use CUID format
- Timestamps (created_at, updated_at) are automatically managed
- Snake case is used for database field names
- Foreign keys are properly indexed
- Proper cascade rules are implemented for relationships

## Getting Started

1. Ensure you have PostgreSQL installed and running
2. Set up your DATABASE_URL in the environment variables
3. Run Prisma migrations to create the database schema
4. Use Prisma Client in your application to interact with the database

## Best Practices

1. Always use transactions for operations that modify multiple tables
2. Implement proper error handling for database operations
3. Use Prisma's built-in validation features
4. Follow the principle of least privilege when assigning user roles
5. Regularly backup your database
6. Monitor database performance and optimize queries as needed
