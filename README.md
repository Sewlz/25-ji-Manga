# <img width="45px" height="45px" src="https://github.com/Sewlz/25-ji-Manga/blob/master/src/assets/og-image.webp"> 25-ji-Manga

**Description:**

25-ji-Manga is a beginner-friendly React application designed to help you browse and read manga. Using the MangaDex API, this project allows users to search for manga titles, view detailed information about each manga, and explore chapters. It features a clean and intuitive interface, making it easy for manga fans to find and enjoy their favorite series.

**Key Features:**

- **Search Functionality:** Quickly find manga titles with a simple search feature.
- **Manga Details:** View information about each manga, such as titles, descriptions, and cover images.
- **Chapter Navigation:** Browse through available chapters for the selected manga.
- **Responsive Design:** Works smoothly on desktops, tablets, and smartphones.

**Prerequisites**

Ensure you have Node.js and npm installed on your machine.

**Steps**

1. **Create a new Vite project**:

   ```bash
   npm create vite@latest
   ```

2. **Navigate to your project directory**:

   ```bash
   cd your-project-name
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Install Axios**:

   ```bash
   npm install axios
   ```

5. **Install Swiper**
   ```bash
   npm install swiper
   ```
6. **Running the Project**
   ```bash
   npm run dev
   ```

Open your browser and go to http://localhost:5173/ to see your project running.

**Project Tree:**

```
react-25jimanga
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ cors-proxy-server
|  └─ index.js
│  └─ package-lock.json
|  └─ package.json
│  └─ readme.md
├─ public
|  └─ screenshot
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ og-image.webp
│  │  ├─ react.svg
│  │  └─ shortcutIcon.png
│  ├─ dev-data
│  │  ├─ header
│  │  │  ├─ header.css
│  │  │  └─ header.jsx
│  │  ├─ home
│  │  │  ├─ home.css
│  │  │  └─ home.jsx
│  │  ├─ info
│  │  │  └─ info.jsx
│  │  ├─ latest-upload
│  │  │  ├─ latest.css
│  │  │  └─ latest.jsx
│  │  ├─ reading
│  │  │  ├─ reading.css
│  │  │  └─ reading.jsx
│  ├─ index.css
│  └─ main.jsx
└─ vite.config.js

```

**Screenshots:**

> Home Screenshot

<div align="center">
  <img width="100%" src="https://github.com/Sewlz/25-ji-Manga/blob/master/public/screenshot/home-screenshot.png">
</div>

> Info Screenshot

<div align="center">
  <img width="100%" src="https://github.com/Sewlz/25-ji-Manga/blob/master/public/screenshot/info-screenshot.png">
</div>

> Reading Screenshot

<div align="center">
  <img width="100%" src="https://github.com/Sewlz/25-ji-Manga/blob/master/public/screenshot/reading-screenshot.png">
</div>
