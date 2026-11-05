# Bidyarthi Free Coaching Centre — Google Forms & Response Management Guide

> **Target Audience:** Non-technical committee members and website administrators.  
> **Purpose:** Step-by-step instructions for creating Google Forms, linking responses to Google Sheets, enabling instant email alerts, and sharing response data with committee members.

---

## Quick Setup Checklist

For every new form (e.g. Admission Application, Free Coaching Registration, Membership, Volunteer, etc.):

- [ ] Log in with the official organisation Google Account (e.g., `bidyarthicoaching@gmail.com`).
- [ ] Create the Google Form in Google Drive with clear questions.
- [ ] **Avoid File Upload questions** (avoids mandatory Google account sign-in for applicants).
- [ ] Link Form responses to a dedicated Google Sheet.
- [ ] Enable **Email Notifications** for new form submissions.
- [ ] Share the Google Sheet with authorized committee members (Viewer/Editor access).
- [ ] Copy the **Form View Link** and **Google Sheet Link** into the website Admin Dashboard at `/admin/forms`.

---

## 1. Creating a New Google Form

1. Go to [drive.google.com](https://drive.google.com) and log in with the official Bidyarthi Coaching Centre Google account.
2. Click **+ New** (top-left) → Select **Google Forms** → **Blank form**.
3. Set the Form Title (e.g., _Admission Application 2026-2027 / ভর্তি আবেদনপত্র_).
4. Add necessary question fields (e.g., Student Name, Guardian Name, Class, Contact Phone Number, Address).
5. Mark essential questions as **Required** (তারকাচিহ্নিত আবশ্যক).

> [!WARNING]
> **CRITICAL: DO NOT USE "FILE UPLOAD" QUESTIONS**
>
> If you add a "File Upload" question (such as asking for photo uploads or document scans), Google **forces all applicants to sign into a Google account** before they can view or fill out the form.  
> Many students and parents do not have or remember their Google password, causing them to abandon the form.  
> **Best Practice:** Keep all fields as text, radio buttons, or dropdowns. Collect physical document copies during classroom verification.

---

## 2. Linking Form Responses to a Google Sheet

By default, responses stay inside Google Forms. Linking them to a Google Sheet organizes all applicant data in a single spreadsheet table.

1. Inside your Google Form, click on the **Responses** tab at the top.
2. Click the green **Link to Sheets** icon (or click the 3-dot menu ⋮ → _Select response destination_).
3. Choose **Create a new spreadsheet** (it defaults to _Form Title (Responses)_).
4. Click **Create**.
5. A new Google Sheet will open automatically in a new browser tab. Copy its URL from the address bar (e.g., `https://docs.google.com/spreadsheets/d/1SAMPLE.../edit`).

---

## 3. Enabling Instant Email Notifications for New Submissions

Never miss an application! Set up automatic email alerts whenever someone submits a form.

### Option A: From Google Forms

1. In Google Forms, click the **Responses** tab.
2. Click the 3-dot menu (⋮) in the top-right of the responses area.
3. Check **Get email notifications for new responses**.

### Option B: From the linked Google Sheet (Recommended for specific alerts)

1. Open the linked Google Sheet.
2. Go to top menu: **Tools** → **Notification settings** → **Edit notifications**.
3. Under _"Notify me at [your-email] when..."_, select **Any changes are made** or **A user submits a form**.
4. Under _"Notify me with..."_, select **Email right away**.
5. Click **Save**.

---

## 4. Sharing the Response Sheet with Committee Members

Keep committee members updated without giving them access to edit the website code.

1. Open the linked Google Sheet.
2. Click the blue **Share** button in the top-right corner.
3. Enter the email addresses of committee members (e.g., Secretary, President, Academic Coordinator).
4. Choose their permission level:
   - **Viewer:** Can view student lists but cannot modify entries.
   - **Editor:** Can add notes, status columns (e.g., "Approved / Rejected"), or edit entries.
5. Click **Send**.

---

## 5. Adding Form Links to the Website Admin Panel

Once your Google Form and Sheet are created:

1. Log in to the Bidyarthi Admin Dashboard at `https://bidyarthicoaching.org/admin/login`.
2. Navigate to **Form Links** (`/admin/forms`).
3. Find the corresponding form card (or click **+ Add New Form Link**).
4. Click **Edit Link**.
5. Paste the **Google Form URL** (must start with `https://docs.google.com/forms/...` or `https://forms.gle/...`).
6. Paste the **Admin Response Sheet URL** (stored privately; only committee admins will see this button in `/admin/forms`).
7. Ensure the **Form Active** toggle is checked.
8. Click **Save Form Details**.

---

## Summary of URL Rules

| Field                  | Allowed Domains                                                | Publicly Visible?                    |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------ |
| **Google Form URL**    | `https://docs.google.com/forms/...` or `https://forms.gle/...` | **YES** (embedded in website iframe) |
| **Response Sheet URL** | `https://docs.google.com/spreadsheets/...`                     | **NO** (Admin Dashboard only)        |
