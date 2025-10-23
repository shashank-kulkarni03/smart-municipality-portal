# 🏛️ Smart Municipality Complaint Management System

A modern, full-stack web application for managing municipal complaints with three role-based panels: Citizen, Officer, and District Admin.

## ✨ Features

### 👥 Citizen Panel

- User registration and authentication
- Submit complaints with photos and GPS location
- Manual location selection on map
- Category-based complaint submission
- Track complaint status in real-time
- View complaint history
- Receive notifications

### 🔧 Officer Panel

- View all complaints in assigned region
- Update complaint status
- Mark complaints as resolved
- Interactive map view with complaint markers
- Filter complaints by status
- View statistics and analytics
- Manage assigned complaints

### 📊 Admin Panel

- Overview of all municipality operations
- Filter complaints by region, status, category, date
- View region-wise statistics
- Manage officers and view their performance
- Generate monthly PDF reports
- Export data to CSV
- Advanced analytics dashboard

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Maps**: Leaflet + OpenStreetMap
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/municipality-portal.git
cd municipality-portal
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Enable Storage
   - Copy your Firebase config

4. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. **Update Firebase config**
   Edit `src/services/firebase.js` with your credentials

6. **Start development server**

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🚀 Deployment

### Deploy to Netlify

1. Build the project:

```bash
npm run build
```

2. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

3. Deploy:

```bash
netlify deploy --prod
```

### Deploy to Firebase Hosting

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

3. Initialize Firebase:

```bash
firebase init hosting
```

4. Build and deploy:

```bash
npm run build
firebase deploy
```

## 📱 User Roles

### Citizen

- Email: citizen@example.com
- Can submit and track complaints

### Officer

- Email: officer@example.com
- Can view and resolve complaints in their region

### Admin

- Email: admin@example.com
- Full access to all features and analytics

## 🗂️ Project Structure

```
municipality-portal/
├── public/
├── src/
│   ├── components/
│   │   ├── common/         # Shared components
│   │   ├── citizen/        # Citizen panel components
│   │   ├── officer/        # Officer panel components
│   │   └── admin/          # Admin panel components
│   ├── context/            # React Context (Auth)
│   ├── pages/              # Page components
│   ├── services/           # Firebase services
│   ├── utils/              # Utility functions
│   ├── App.jsx
│   └── index.js
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Firebase Security Rules

**Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    match /complaints/{complaintId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.token.role in ['officer', 'admin'];
      allow delete: if request.auth.token.role == 'admin';
    }
  }
}
```

**Storage Rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /complaints/{complaintId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 📊 Database Schema

### Collections

**users**

```javascript
{
  uid: string,
  name: string,
  email: string,
  phone: string,
  role: 'citizen' | 'officer' | 'admin',
  region: string (for officers),
  createdAt: timestamp
}
```

**complaints**

```javascript
{
  id: string,
  citizenId: string,
  title: string,
  category: string,
  description: string,
  images: array,
  location: {
    latitude: number,
    longitude: number,
    address: string
  },
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved',
  assignedOfficer: string,
  region: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

## 🙏 Acknowledgments

- React.js Team
- Firebase Team
- Tailwind CSS
- Leaflet Maps
- OpenStreetMap Contributors

---

Made with ❤️ for better municipal services
