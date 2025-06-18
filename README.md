# PDF Fragment Selector

A React-based web application that allows users to upload and view a PDF file, cut out fragments on any page, and convert them into Base64 images.


## ✨ Features

- 📄 Load PDF file via URL (`fileName` GET param)
- 🖼️ Render all pages using `pdfjs-dist` and HTML5 Canvas
- 🖱️ Select arbitrary rectangular areas with the mouse
- 🧠 Save selected fragments as Base64 images in Redux store
- 📂 View selected fragments in a right-hand preview panel


## 🔧 Technologies

- React + TypeScript
- Redux Toolkit for state management
- pdfjs-dist for PDF rendering
- HTML5 Canvas for drawing and interaction


## Scripts

- **`npm run dev`**       # start dev server
- **`npm run build`**     # build project