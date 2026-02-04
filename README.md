# My-Circle-App

## Favorite Quotes

> "The only way to do great work is to love what you do." – Steve Jobs

> "Man is affected not by events but by the view he takes of them." — Seneca

---

# Frontend Architecture

## Authentication

Authentication is handled via Supabase Auth with a React Context provider pattern.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/providers/session-provider.tsx` | Auth context provider with user state and signOut method |
| `src/components/user-menu.tsx` | Displays user name and logout button |
| `src/app/(protected)/layout.tsx` | Layout wrapper for authenticated routes |

### How It Works

1. **Server-side**: The root layout fetches the user from Supabase and passes it to `SessionProvider` as `initialUser`
2. **Client-side**: `SessionProvider` hydrates with the server user and subscribes to auth state changes
3. **Components**: Use the `useAuth()` hook to access `user`, `loading`, and `signOut`

```tsx
// Accessing auth state in a component
import { useAuth } from "@/app/providers/session-provider";

function MyComponent() {
  const { user, signOut } = useAuth();
  return <button onClick={signOut}>Logout {user?.email}</button>;
}
```

### Sign Out Flow

1. User clicks logout in `UserMenu`
2. `signOut()` is called from auth context
3. Supabase session is cleared
4. User state is set to null
5. Router redirects to `/auth/login`

---

## Component Architecture

### Header

The `Header` component is a **reusable component**, not part of the layout. Each page imports and renders it with its own title.

**Why?** The layout is for truly shared UI (side nav, footer). The header title varies per page, so pages compose it themselves.

```
src/
  components/
    header.tsx        ← Reusable, receives title as prop
    user-menu.tsx     ← Auth-aware, uses useAuth hook
  app/
    (protected)/
      layout.tsx      ← Shared structure (padding, auth protection)
      dashboard/
        page.tsx      ← Renders <Header title="Dashboard" />
      contacts/
        page.tsx      ← Renders <Header title="Contacts" />
```

### Component Responsibilities

| Component | Server/Client | Responsibility |
|-----------|---------------|----------------|
| `Header` | Server | Display page title, render UserMenu |
| `UserMenu` | Client | Show user name, handle logout |
| `SessionProvider` | Client | Manage auth state, provide context |
| Protected Layout | Server | Shared structure, wraps with providers |

---

# API

## Contacts API

All endpoints require authentication. Requests made without a valid session will return **401 Unauthorized**.

Base path: `/api/contacts`

---

### GET `/api/contacts`

List all contacts belonging to the authenticated user.

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| limit | number | No | Number of records to return (default: 25, max: 100) |
| offset | number | No | Number of records to skip (default: 0) |
| search | string | No | Case-insensitive search on first_name, last_name, email, or phone |
| relationship_type | string | No | Filter by relationship type (family, friend, colleague, acquaintance, other) |

#### Example Request

```http
GET /api/contacts?limit=20&offset=0&search=john&relationship_type=friend
```

#### Success Response — `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "relationship_type": "friend",
      "birthday": "1990-01-01",
      "notes": "College friend",
      "important_dates": [
        { "label": "Anniversary", "date": "2015-06-01" }
      ],
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 57
  }
}
```

---

### POST `/api/contacts`

Create a new contact.

#### Request Body

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "phone": "555-9876",
  "relationship_type": "family",
  "birthday": "1988-03-15",
  "notes": "Cousin",
  "important_dates": [
    { "label": "Wedding", "date": "2020-09-10" }
  ]
}
```

#### Success Response — `201 Created`

```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "555-9876",
    "relationship_type": "family",
    "birthday": "1988-03-15",
    "notes": "Cousin",
    "important_dates": [],
    "created_at": "2024-01-02T14:30:00Z",
    "updated_at": "2024-01-02T14:30:00Z"
  }
}
```

---

### GET `/api/contacts/:id`

Retrieve a single contact by ID.

#### Path Parameters

| Name | Type | Description |
|------|------|-------------|
| id | UUID | Contact ID |

#### Example Request

```http
GET /api/contacts/5d2f3c9c-8a9b-4f5b-bc92-ef2ccecf8c11
```

#### Success Response — `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "relationship_type": "friend",
    "birthday": "1990-01-01",
    "notes": "College friend",
    "important_dates": [],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

### PUT `/api/contacts/:id`

Update an existing contact. Supports partial updates.

#### Request Body (partial)

```json
{
  "phone": "555-0000",
  "notes": "Moved to Seattle"
}
```

#### Success Response — `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "555-0000",
    "relationship_type": "friend",
    "birthday": "1990-01-01",
    "notes": "Moved to Seattle",
    "important_dates": [],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-05T09:12:00Z"
  }
}
```

---

### DELETE `/api/contacts/:id`

Delete a contact by ID.

#### Example Request

```http
DELETE /api/contacts/5d2f3c9c-8a9b-4f5b-bc92-ef2ccecf8c11
```

#### Success Response — `200 OK`

```json
{
  "success": true
}
```

---

## Error Responses

All errors follow a consistent JSON format.

### `401 Unauthorized`

```json
{
  "error": {
    "message": "Unauthorized"
  }
}
```

### `400 Validation Error`

```json
{
  "error": {
    "message": "Validation failed",
    "details": {
      "fieldErrors": {
        "first_name": ["Required"]
      }
    }
  }
}
```

### `404 Not Found`

```json
{
  "error": {
    "message": "Contact not found"
  }
}
```

### `500 Internal Server Error`

```json
{
  "error": {
    "message": "Unexpected error"
  }
}
```

---

## Notes

- All contacts are scoped to the authenticated user via **Row Level Security (RLS)** in Supabase.
- Requests without authentication will be rejected by the global `proxy.ts` middleware.
- Pagination metadata is always returned for list endpoints.
- Date fields use ISO format (`YYYY-MM-DD` for dates, RFC3339 for timestamps).

# Database Schema

## Contacts Database Schema

The `contacts` table stores relationship and contact information for each authenticated user.  
All records are scoped to a user via `user_id` and protected using Supabase Row Level Security (RLS).

### Table: `contacts`

| Column | Type | Nullable | Description |
|------|------|----------|-------------|
| `id` | uuid | No | Primary key, auto-generated |
| `user_id` | uuid | No | Foreign key to `auth.users(id)` |
| `fname` | text | No | Contact’s first name |
| `lname` | text | No | Contact’s last name |
| `email` | text | Yes | Email address |
| `phone` | text | Yes | Phone number |
| `relationship` | ENUM | No | Relationship category (`family`, `friend`, `colleague`, `acquaintance`, `other`) |
| `dob` | date | Yes | Birthday (`YYYY-MM-DD`) |
| `notes` | text | Yes | Free-form notes |
| `created_at` | timestamptz | No | Record creation timestamp |
| `updated_at` | timestamptz | No | Last update timestamp |

---

### Relationship Type Values

Allowed values for `relationship`:

- `family`
- `friend`
- `colleague`
- `acquaintance`
- `other`

---

### Indexes

The following indexes are defined to support efficient querying:

- `contacts.user_id`
- `contacts.user_id, contacts.created_at DESC`

These indexes optimize:
- Per-user contact lookups
- Paginated listing ordered by creation date

---

### Row Level Security (RLS)

Row Level Security is enabled on the `contacts` table to ensure user data isolation.

Policies:

- **SELECT**: Users can only read contacts where `user_id = auth.uid()`
- **INSERT**: Users can only create contacts with their own `user_id`
- **UPDATE**: Users can only update their own contacts
- **DELETE**: Users can only delete their own contacts

This ensures contacts are fully isolated per authenticated user, even if API-level checks are bypassed.

---

### Triggers

A database trigger automatically updates the `updated_at` column on every update:

- `updated_at` is set to `now()` whenever a row is modified

---

### Notes

- All date values use ISO format (`YYYY-MM-DD`)
- Timestamps use UTC (`timestamptz`)
- Data integrity is enforced at both the API and database (RLS) layers

## Swagger (OpenAPI) API Testing

This project includes a built-in Swagger UI for testing API routes in the browser.

- OpenAPI spec: `GET /api/openapi`
- Swagger UI: `GET /api/docs`

### Notes on Authentication

Authentication uses Supabase session cookies (SSR).
If you are logged into the app, Swagger UI requests will automatically include cookies and allow testing protected endpoints.
If you are not logged in, protected endpoints return `401 Unauthorized`.
