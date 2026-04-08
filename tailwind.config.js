// tailwind.config.js
module.exports = {
  darkMode: 'class', // Ensure this is set to 'class'
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        input: 'hsl(var(--input))',
      }
    }
  }
}