# HostelHub - Hostel Allocation Management System Frontend

A modern, beautiful React + Vite frontend for the Hostel Allocation Management System with Claymorphism + Vibrant & Block-based UI design.

## 🎨 Design System

### Claymorphism Features
- **Soft Shadows**: Smooth, layered shadow effects creating depth
- **Vibrant Colors**: Bold, energetic colors with smooth gradients
- **Block-based Layout**: Clean, organized component structure
- **Interactive Elements**: Smooth transitions and hover animations
- **Generous Spacing**: Comfortable padding and gaps throughout

### Color Palette
- **Primary**: #FF6B6B (Vibrant Coral Red)
- **Secondary**: #4ECDC4 (Vibrant Teal)
- **Accents**: Orange, Purple, Green, Blue, Pink

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation & Running

```bash
# Install dependencies (use --legacy-peer-deps for React 19 compatibility)
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173/`

## 📁 Project Structure

```
src/
├── pages/
│   ├── Auth.jsx                 # Login & Register
│   ├── StudentDashboard.jsx     # Student dashboard
│   ├── StudentPages.jsx         # Browse hostels & rooms
│   ├── AdminPages.jsx           # Admin management
│   └── AdminRoomsAllocations.jsx # Allocations management
├── components/
│   ├── index.jsx                # Reusable UI components
│   └── Layout.jsx               # Navigation & layout
├── context/
│   └── AuthContext.jsx          # Auth state management
├── services/
│   └── api.js                   # API client
├── styles/
│   ├── theme.css                # Design tokens
│   ├── components.css           # Component styles
│   └── layout.css               # Layout styles
├── App.jsx                      # Main app & routing
└── main.jsx                     # Entry point
```

## 🎯 Features

### For Students
- 🔐 Register & Login
- 📊 Dashboard with allocation status
- 🏢 Browse hostels with details
- 🚪 Browse and search rooms
- 📋 Track applications
- 📱 Fully responsive

### For Admins
- 👥 Manage students
- 🏢 Manage hostels
- 🚪 Manage rooms
- 📊 View allocations
- 📈 Dashboard with statistics

## 🧩 UI Components

**Base Components:**
- Button (4 variants)
- Input (with validation)
- Card (with header/footer)
- Badge & Status Badge
- Select, Textarea
- Alert, Loading, Empty

**Layout Components:**
- Sidebar (with collapse)
- Topbar (with search & notifications)
- DashboardLayout
- PageHeader

## 🔐 Authentication

- Mock authentication system
- Role-based access control (Student/Admin)
- Session management with localStorage
- Protected routes with automatic redirects

## 📱 Responsive Design

Optimized for:
- Desktop (1400px+)
- Tablet (768px - 1399px)
- Mobile (<768px)

## 🔌 API Configuration

Backend URL: `http://localhost:3000`

Edit in `src/services/api.js` to change the backend URL.

### Available Endpoints
- Students: `/students`
- Admins: `/admins`
- Hostels: `/hostels`
- Rooms: `/rooms`
- Allocations: `/allocations`

## 🛠 Development

### Technologies Used
- React 19
- Vite 8
- React Router 6
- Axios
- Lucide React (Icons)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## 🎓 Usage Examples

### Login
1. Choose user type (Student/Admin)
2. Enter email and password
3. Click "Sign In"

### Browse Hostels
1. Go to "Available Hostels"
2. Search by name or location
3. View capacity and facilities
4. Click "Browse Rooms" to see available rooms

### Manage Students (Admin)
1. Go to "Manage Students"
2. View all students in a table
3. Click View/Edit/Delete actions

## 📝 Notes

- All demo data is hardcoded for demonstration
- Connect to real backend by implementing actual API calls
- Styling uses CSS variables for easy theme customization
- Components are fully documented with JSDoc comments

## 🎨 Customization

### Change Colors
Edit `src/styles/theme.css` - Update the CSS custom properties:
```css
:root {
  --color-primary: #FF6B6B;
  /* ... other colors ... */
}
```

### Modify Spacing
Update spacing variables in `theme.css`:
```css
--space-md: 16px;
--space-lg: 24px;
```

## 📄 License

Open source for educational purposes.

## 👥 Support

For questions or issues, check the main project README or backend documentation.

---

**Ready to use!** The frontend is fully functional with mock data and ready to connect to your backend API.


The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
