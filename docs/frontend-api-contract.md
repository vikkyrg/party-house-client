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
- **Query Params:** `roomId`, `date` (`YYYY-MM-DD`)
- **Auth Required:** No

### Reserve a Selected Slot
- **Method:** `POST`
- **URL:** `/bookings/hold`
- **Auth Required:** Yes (guest/customer session)
- **Request Body:**
  ```json
  {
    "theaterId": "THEATER_ID",
    "roomId": "ROOM_ID",
    "date": "YYYY-MM-DD",
    "timeSlot": "10:30 AM - 12:30 PM",
    "timeSlotId": "ROOM_SLOT_ID",
    "duration": 2,
    "holdId": "24_CHARACTER_HEX_ID"
  }
  ```
- Reuse the returned `holdId` when creating the booking. Holds expire after 10 minutes.
- The API sets an HttpOnly `bookingSession` cookie. Keep the hold ID in the current browser session and never place it or customer data in a URL.
- Release an abandoned hold with `DELETE /bookings/hold/:holdId`; the server only releases holds owned by that browser session.
- Pass the selected theater, room, date, and slot through client-side navigation state, not query parameters. Opening a copied `/book/:theaterId` URL without that state returns the customer to theater selection.
- Save and restore non-payment progress with `GET`, `PUT`, or `DELETE /bookings/drafts/:draftId`. Drafts are scoped to the HttpOnly browser session and expire after 24 hours.
- `GET /bookings/current-session` restores only the active booking for the authenticated account or the current guest browser session; it returns `null` when there is no active booking.

### Create Booking
- **Method:** `POST`
- **URL:** `/bookings`
- **Auth Required:** Yes (Bearer Token)
- **Request Body:**
  ```json
  {
    "theaterId": "THEATER_ID",
    "roomId": "ROOM_ID",
    "date": "YYYY-MM-DD",
    "timeSlot": "10:30 AM - 12:30 PM",
    "timeSlotId": "ROOM_SLOT_ID",
    "slotHoldId": "HOLD_ID_FROM_RESERVE_REQUEST",
    "duration": 2,
    "eventTypeId": "EVENT_TYPE_ID",
    "customerDetails": {
      "name": "John Doe",
      "phone": "8147897771",
      "email": "john@example.com",
      "members": 2
    }
  }
  ```

### My Bookings
- **Method:** `GET`
- **URL:** `/bookings/my`
- **Auth Required:** Yes (Bearer Token)

---

## 5. Payment

### Submit Static QR Payment Confirmation
- **Method:** `POST`
- **URL:** `/payment/submit-upi`
- **Auth Required:** Yes (Bearer Token)
- **Request Body:**
  ```json
  {
    "bookingId": "BOOKING_ID",
    "paymentAmount": 750,
    "transactionReference": "UPI_TRANSACTION_REFERENCE"
  }
  ```
- The customer-entered amount is stored as a pending payment record until an admin verifies it.

### Check Payment Status
- **Method:** `GET`
- **URL:** `/payment/status/:bookingId`
- **Auth Required:** Yes (booking owner or admin)

---

*Note: Mismatches between the prompt and the actual server stack will be handled by adhering to the prompt's instruction: "If the repository already has a frontend stack, preserve it unless there is a strong technical reason to change it."*
