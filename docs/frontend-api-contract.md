# Frontend API Contract

This document details the expected API contracts between the CS Cinemas frontend and backend, based on the provided Postman collection.

## Base URL
`/api/v1` (Configured via `VITE_API_BASE_URL`)

---

## 1. Auth

### Register
- **Method:** `POST`
- **URL:** `/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "8147897771",
    "password": "Test@1234"
  }
  ```

### Login
- **Method:** `POST`
- **URL:** `/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Test@1234"
  }
  ```

### Verify OTP
- **Method:** `POST`
- **URL:** `/auth/verify-otp`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "phone": "8147897771",
    "otp": "123456"
  }
  ```

### Get Current User
- **Method:** `GET`
- **URL:** `/auth/me`
- **Auth Required:** Yes (Bearer Token)

---

## 2. Content & Discovery

### Get Cities
- **Method:** `GET`
- **URL:** `/cities`
- **Auth Required:** No

### Get Event Types
- **Method:** `GET`
- **URL:** `/event-types`
- **Auth Required:** No

### Get Add-ons
- **Method:** `GET`
- **URL:** `/addons`
- **Auth Required:** No

### Get Banners
- **Method:** `GET`
- **URL:** `/banners`
- **Query Params:** `position` (e.g., `homepage-hero`)
- **Auth Required:** No

### Get FAQs
- **Method:** `GET`
- **URL:** `/faqs`
- **Auth Required:** No

### Get Testimonials
- **Method:** `GET`
- **URL:** `/testimonials`
- **Auth Required:** No

---

## 3. Theaters

### Get Theaters
- **Method:** `GET`
- **URL:** `/theaters`
- **Auth Required:** No
- **Query Params:**
  - Support for `city`, `location`, `eventType`, `date`, `capacity`, `page`, etc. (To be handled appropriately based on actual backend implementation).

### Get Theater Availability
- **Method:** `GET`
- **URL:** `/theaters/:id/availability`
- **Query Params:** `date` (format: `YYYY-MM-DD`)
- **Auth Required:** No

---

## 4. Bookings

### Check Availability
- **Method:** `GET`
- **URL:** `/bookings/check-availability`
- **Query Params:** `theaterId`, `date`
- **Auth Required:** No

### Create Booking
- **Method:** `POST`
- **URL:** `/bookings`
- **Auth Required:** Yes (Bearer Token)
- **Request Body:**
  ```json
  {
    "theaterId": "THEATER_ID",
    "date": "YYYY-MM-DD",
    "timeSlot": "2:00 PM - 5:00 PM",
    "eventTypeId": "EVENT_TYPE_ID",
    "customerDetails": {
      "name": "John Doe",
      "phone": "8147897771",
      "email": "john@example.com"
    }
  }
  ```

### My Bookings
- **Method:** `GET`
- **URL:** `/bookings/my`
- **Auth Required:** Yes (Bearer Token)

---

## 5. Payment

### Create Order
- **Method:** `POST`
- **URL:** `/payment/create-order`
- **Auth Required:** Yes (Bearer Token)
- **Request Body:**
  ```json
  {
    "bookingId": "BOOKING_ID"
  }
  ```

---

*Note: Mismatches between the prompt and the actual server stack will be handled by adhering to the prompt's instruction: "If the repository already has a frontend stack, preserve it unless there is a strong technical reason to change it."*
