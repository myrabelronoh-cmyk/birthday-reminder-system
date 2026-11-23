# Birthday Reminder

Birthday Reminder System is a web application for organizing important birthdays in one place. It helps users keep track of friends, family, and colleagues, see who is celebrating today or soon, and avoid relying on scattered notes that can be lost or forgotten.

## Problem Statement

Busy schedules make it easy to forget birthdays. Important dates may be spread across notebooks and other notes, and missing them can affect personal and professional relationships. People need a convenient, organized way to keep track of upcoming celebrations and remember to send timely wishes.

## Proposed Solution

The Birthday Reminder System provides a centralized dashboard for organizing and tracking important birthdays. It highlights birthdays happening today, shows upcoming celebrations and the age a person is turning, and is designed to support contact categories and reminder notifications.

## MVP

The planned minimum viable product includes:

- Secure user sign-in
- Adding, editing, and deleting birthday entries
- A dashboard highlighting today's and upcoming birthdays
- Automatic calculation of the age each person is turning
- Searching contacts by name or category
- Generating or copying a quick birthday wish template

Some MVP features are still in development. The current dashboard uses sample birthday records; birthday entry management, persistent birthday storage, category search, notifications, and wish templates are not implemented yet.

## Features

- Email and password sign-up and sign-in
- Firebase authentication session handling
- Dashboard with birthday statistics
- Today's birthday notifications
- Upcoming birthday countdowns
- Search birthdays by name
- Birthday categories and age calculations
- Responsive React interface
- Lucide icons

## Technology Stack

### Currently used

- React 19 and React DOM
- Vite 8
- React Router
- Firebase SDK and Firebase Authentication
- Lucide React for icons
- JavaScript and CSS
- Vitest, React Testing Library, and jsdom for testing
- Oxlint for linting
- Firebase Hosting for deployment

### Proposed for future development

- Tailwind CSS for styling
- JSON-server or another mock REST API for birthday data

Tailwind CSS and JSON-server are not currently installed or configured.

## Project Structure

```text
src/
  App.jsx                 # Main dashboard and birthday UI
  firebase.js             # Firebase initialization
  components/
    AuthScreen.jsx        # Sign-in and sign-up interface
  context/
    Authcontext.jsx       # Authentication provider
  hooks/
    useAuth.js            # Authentication context hook
  data/
    mockBirthdays.js      # Sample birthday records
  test/
    setup.js              # Test environment setup
```

## Getting Started

### Prerequisites

- Node.js
- npm
- A Firebase project

### Installation

```sh
npm install
```

### Firebase Authentication Setup

1. Create a Firebase project in the Firebase Console.
2. Enable the **Email/Password** sign-in provider under **Authentication**.
3. Register a web application in Firebase.
4. Add the web app configuration to `src/firebase.js`.
5. Add authorized domains if the app is deployed to a custom domain.

The app currently uses a Firebase web configuration in `src/firebase.js`.

### Run the Development Server

```sh
npm run dev
```

Open the local URL shown by Vite.

### Production Build

```sh
npm run build
```

### Preview the Production Build

```sh
npm run preview
```

## Testing

Run the test suite:

```sh
npm test
```

Generate a coverage report:

```sh
npm run test:coverage
```

The coverage command includes the authentication screen and authentication context and requires at least 69% statement, branch, function, and line coverage. Firebase calls are mocked in tests, so the tests do not create real accounts or contact Firebase.

## Linting

```sh
npm run lint
```

## Deployment

Firebase Hosting is configured to deploy Vite's production output in `dist/`.

1. Make sure Firebase Authentication's **Email/Password** provider is enabled in the Firebase project configured in `src/firebase.js`.
2. Log in to Firebase CLI and select the Firebase project to use for Hosting:

   ```sh
   npx firebase-tools login
   npx firebase-tools use --add
   ```

   Select the Hosting project when prompted. The project currently selected for Hosting in `.firebaserc` differs from the Firebase project ID in `src/firebase.js`. That can be intentional, but make sure the Authentication project has the deployed site's domain authorized.

3. Build and deploy:

   ```sh
   npm run build
   npx firebase-tools deploy --only hosting
   ```

Firebase CLI will print the deployed site URL when deployment completes.

## Push Changes to GitHub

From the project directory, stage only the project files you intend to publish. Avoid `git add .` in this checkout because the Git repository is located in the parent directory and may include unrelated files.

```sh
git add README.md firebase.json src/firebase.js src/hooks/useAuth.js src/main.jsx
git diff --cached
git commit -m "Update project documentation and Firebase setup"
git push -u origin feature/project-setup
```

## Current Data State

The dashboard currently uses sample birthday records from `src/data/mockBirthdays.js`. Adding, editing, deleting, and persistent birthday storage are planned features. Firebase Authentication is implemented; birthday data is not yet stored in Firebase or a JSON-server API.
