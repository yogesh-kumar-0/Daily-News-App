# 📰 Daily News App

A modern, feature-rich news application built with React that delivers real-time news across multiple categories. Stay informed with breaking news from Business, Entertainment, Health, Science, Sports, and Technology sectors.

![Daily News App](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

## ✨ Features

- 📰 **Multi-Category News Feed** - Browse news from 6+ different categories
  - Business & Finance
  - Entertainment
  - Health & Science
  - Sports
  - Technology
  
- 🔍 **Smart Search** - Quickly find news categories with the built-in search overlay
- 🔖 **Save & Bookmark** - Bookmark your favorite articles for later reading
- 🌓 **Dark/Light Mode** - Toggle between themes for comfortable reading
- ♾️ **Infinite Scroll** - Seamlessly load more articles as you scroll
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Optimized for speed with lazy loading and caching
- 🎨 **Professional UI** - Modern, sleek interface with smooth animations
- 📊 **Live News Ticker** - Stay updated with a live news ticker at the top

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yogesh-kumar-0/Daily-News-App.git
cd Daily-News-App
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
REACT_APP_API_KEY=your_newsapi_key_here
```

Get your free API key from [NewsAPI.org](https://newsapi.org)

4. **Start the development server**
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode with hot reloading.

### Build
```bash
npm run build
```
Creates a production-ready build in the `build` folder.

### Testing
```bash
npm test
```
Runs the test suite in interactive watch mode.

### Eject
```bash
npm run eject
```
Exposes all configuration (one-way operation).

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Routing**: React Router v7.7.0
- **Component Architecture**: Class-based Components
- **Styling**: CSS3 with CSS Variables
- **Icons**: Font Awesome 6.5.1
- **Infinite Scroll**: react-infinite-scroll-component
- **Progress Bar**: react-top-loading-bar
- **API**: NewsAPI (https://newsapi.org)
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── Components/
│   ├── NavBar.js          # Navigation bar with search & theme toggle
│   ├── News.js            # Category news list with infinite scroll
│   ├── NewsItems.js       # Individual news card component
│   └── spinner.js         # Loading spinner
├── App.js                 # Main app component with routing
├── App.css                # Global styles
├── index.js               # React entry point
├── index.css              # Base styles
└── samplresponse.json     # Sample API response for testing
```

## 🎯 Key Components

### NavBar
- Navigation between categories
- Search overlay with live filtering
- Theme toggle (Dark/Light mode)
- Bookmarks management
- Live ticker display
- Responsive mobile menu

### News
- Infinite scroll pagination
- Real-time news fetching
- Loading states
- Error handling
- Category filtering

### NewsItems
- Individual article cards
- Bookmark toggle
- Read more links
- Image lazy loading
- Metadata display

## 🌐 API Integration

This app uses the **NewsAPI** - a free API for news:
- Real-time news data
- Multiple language support
- Filtering by category and country
- No authentication required for free tier

[Get your API key here](https://newsapi.org)

## 🎨 UI/UX Features

- **Rich Color Scheme** - Dark and light themes with accent colors
- **Font Awesome Icons** - Professional icon library
- **Smooth Animations** - Transitions and keyframe animations
- **Loading States** - Top progress bar and skeleton loaders
- **Live Ticker** - Scrolling news updates
- **Search UI** - Overlay modal with search functionality
- **Card-based Layout** - Clean, organized content presentation

## 📱 Responsive Breakpoints

- **Desktop**: > 960px
- **Tablet**: 600px - 960px
- **Mobile**: < 600px

Mobile menu automatically appears on tablets and phones with touch-friendly interface.

## ⚙️ Configuration

### Color Scheme (CSS Variables)
```css
--accent: Primary color for highlights
--text: Main text color
--bg: Background color
--card: Card background
--border: Border color
```

### Theme Support
- Light mode: Optimized for daytime reading
- Dark mode: Reduces eye strain in low-light conditions

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `REACT_APP_API_KEY`
   - Deploy

### Environment Variables
Add to Vercel project settings:
- `REACT_APP_API_KEY`: Your NewsAPI key

## 🔐 Security

- No sensitive data stored in repository
- API keys managed via environment variables
- CORS-enabled API calls
- Content Security Policy ready

## 📊 Performance Optimizations

- Code splitting with React Router
- Lazy loading of images
- Infinite scroll instead of pagination
- Memoization for expensive computations
- CSS-in-JS optimization
- Production build minification

## 🐛 Known Issues & Limitations

- NewsAPI free tier has rate limits (100 requests/day)
- Some articles may not display due to API source restrictions
- Daily news update frequency depends on API availability

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Yogesh Kumar**
- GitHub: [@yogesh-kumar-0](https://github.com/yogesh-kumar-0)

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org) - For the news data API
- [Font Awesome](https://fontawesome.com) - For the icon library
- [React](https://react.dev) - For the JavaScript framework
- [Create React App](https://create-react-app.dev) - For the project setup

## 📞 Support

If you encounter any issues, please:
1. Check the [Issues](https://github.com/yogesh-kumar-0/Daily-News-App/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Multi-category news feed
- Dark/Light theme support
- Infinite scroll pagination
- Bookmark functionality
- Professional UI with Font Awesome icons

---

**Made with ❤️ by Yogesh Kumar**
