# Dynamic Portfolio Application

A modern, responsive portfolio website built with React and Vite that dynamically fetches and displays profile data, projects, skills, and expertise areas from a backend API.

## 🚀 Features

### Dynamic Content Management
- **API Integration**: Dynamically loads profile data, projects, skills, and areas of expertise from backend API
- **Real-time Updates**: Content updates automatically when backend data changes
- **Flexible Data Structure**: Supports multiple profile formats and content types

### Modern UI/UX
- **Glass Morphism Design**: Beautiful transparent backgrounds with backdrop blur effects
- **Sea Green & Coral Theme**: Unique color palette with `#00a693` (sea green) and `#ff6b6b` (coral)
- **Animated Components**: Floating icons, bouncing letters, and smooth transitions
- **Interactive Elements**: Expandable sections, hoverable cards, and modal dialogs

### Responsive Design
- **Mobile-First Approach**: Optimized for all device sizes
- **Grid Layouts**: CSS Grid and Flexbox for perfect alignment
- **Adaptive Typography**: Scalable fonts and spacing

### Key Pages & Components
- **Landing Page**: Hero section with animated profile introduction
- **About Page**: Detailed biography, areas of expertise, and technical skills
- **Portfolio Page**: Project showcase with detailed project views
- **Project Details**: Individual project pages with image galleries and tech stacks

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router
- **Build Tool**: Vite
- **Styling**: SCSS with CSS Grid/Flexbox
- **Icons**: Custom SVG icons and emoji
- **API Integration**: RESTful API calls
- **Animations**: CSS animations and transitions

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Design Features

### Color Palette
- **Primary**: `#00a693` (Sea Green)
- **Secondary**: `#ff6b6b` (Coral)
- **Text**: `#1e293b`, `#64748b` (Dark Slate)
- **Backgrounds**: Transparent overlays with `rgba(0, 166, 147, 0.1)`

### Animation System
- **Float Animations**: Continuous floating for background elements
- **Letter Animations**: Bouncing letters in headings
- **Card Reveals**: Staggered fade-in animations
- **Hover Effects**: Transform and color transitions

## 📡 API Integration

The application connects to a backend API to fetch:

```javascript
// Profile Data Structure
{
  "fullName": "John Doe",
  "title": "Full Stack Developer",
  "bio": "Passionate developer...",
  "profileImage": "profile.jpg",
  "aboutSections": {
    "content": "Detailed biography content..."
  },
  "areas": [
    {
      "id": 1,
      "name": "Frontend Development",
      "description": "Creating beautiful interfaces...",
      "skillsList": ["React", "Vue.js", "JavaScript"]
    }
  ],
  "skills": ["React", "Node.js", "Python"],
  "projects": [...],
  "email": "john@example.com",
  "linkedin": "linkedin.com/in/johndoe"
}
```

## 🎯 Key Components

### AboutPage
- Dynamic areas of expertise from API
- Intelligent icon mapping based on area names
- Interactive expandable sections
- Mouse-tracking 3D profile image

### Portfolio Pages
- Project cards with hover effects
- Detailed project views with image galleries
- Technology stack visualization
- Routing between portfolio sections

### Glass Morphism System
- Consistent transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows
- Smooth hover transitions

## 🚀 Deployment

The application is production-ready with:
- Optimized bundle size
- Static asset optimization
- SEO-friendly routing
- Cross-browser compatibility

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Customization

### Colors
Update the color variables in SCSS files:
```scss
$sea-green: #00a693;
$coral: #ff6b6b;
$dark-slate: #1e293b;
```

### API Endpoint
Configure your API endpoint in `src/services/api.js`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using React + Vite**
