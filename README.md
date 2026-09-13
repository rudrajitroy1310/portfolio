# Rudrajit Roy — Portfolio

Built with React (Vite) + plain CSS.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

## Folder structure

```
src/
  assets/images/       -> hero background image
  components/
    Navbar/             -> Navbar.jsx + Navbar.css
    Hero/                -> Hero.jsx + Hero.css
    About/               -> About.jsx + About.css   (placeholder content)
    Skills/              -> Skills.jsx + Skills.css (placeholder content)
    Projects/            -> Projects.jsx + Projects.css (placeholder content)
    Contact/             -> Contact.jsx + Contact.css (placeholder content)
    Footer/              -> Footer.jsx + Footer.css
  App.jsx                -> combines all sections
  index.css              -> global styles, fonts, CSS variables
```

Every section lives in its own folder with its own component file and its
own CSS file, so editing one section never touches another. Update the
placeholder text in About, Skills, Projects and Contact with your real
content whenever you're ready.
