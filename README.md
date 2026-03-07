# CareConnect - Patient Query & Appointment System

CareConnect is a modern, responsive web application designed to streamline patient interactions, appointment bookings, and healthcare inquiries. It provides a seamless interface for patients to schedule both in-person and online consultations, while automatically generating Google Meet links and sending email confirmations.

## 🚀 Features

*   **Dynamic Dashboard:** View real-time appointment availability on an interactive daily calendar.
*   **Dual-Mode Appointments:** 
    *   **In-Person:** Standard clinic visits.
    *   **Online (Telehealth):** Automatically generates a unique Google Meet link for virtual consultations.
*   **Automated Email Notifications:** Integrates with EmailJS to instantly send booking confirmations and meeting links directly to the patient's inbox.
*   **Patient Query System:** A dedicated portal for patients to submit health-related questions.
*   **Smart Department Routing:** Dynamic doctor selection based on the chosen medical department.
*   **Demo Authentication:** A streamlined login system designed for hackathon demonstrations, featuring persistent user sessions and form auto-filling.

## 🛠️ Tech Stack

*   **Frontend Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **Icons:** Lucide React
*   **Notifications:** React Hot Toast
*   **Backend / Database:** Supabase (PostgreSQL)
*   **Email Service:** EmailJS

## 📂 Project Structure

The project is cleanly separated into two main directories:

*   `/frontend`: Contains the complete React application (components, pages, services, context).
*    `/backend`: Contains the Supabase SQL schema definitions and dummy data seeding scripts.

## ⚙️ Getting Started

Follow these steps to run the application locally.

### Prerequisites
*   Node.js installed on your machine.
*   A free Supabase project.
*   A free EmailJS account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/patient-query-appointment-system.git
    cd patient-query-appointment-system/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `frontend` directory and add your keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

    VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
    ```

4.  **Set up the Database:**
    *   Go to your Supabase project's SQL Editor.
    *   Run the SQL statements found in `backend/supabase/migrations/schema.sql` to create the tables.
    *   *(Optional)* Run `backend/supabase/migrations/seed_data.sql` to populate the calendar with dummy appointments.

5.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🧑‍💻 Hackathon Demo Usage

To test the end-to-end flow during a demonstration:
1.  Navigate to the Login page.
2.  Log in using any valid email address you want to test with (e.g., your personal email). The fixed demo password is `demo123`.
3.  Go to the "Book Appointment" tab.
4.  Notice that your email is auto-filled. Select "Online (Google Meet)" as the appointment type.
5.  Submit the form. An email containing a Google Meet link will instantly be dispatched to the email you logged in with!
