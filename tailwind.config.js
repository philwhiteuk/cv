module.exports = {
  content: [
    "./_layouts/**/*.html",
    "./_includes/**/*.html",
    "./_posts/**/*.md",
    "./_pages/**/*.md",
    "./_projects/**/*.md",
    "./pages/**/*.html",
    "./pages/**/*.md",
    "./_interests/**/*.md",
    "./_tags/**/*.md",
    "./*.md",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#d16f00',
          gradient: '#5105a7',
          fg: '#ffffff',
          highlight: '#7700ff',
          emphasis: '#ffffff',
        },
        secondary: {
          bg: '#ffffff',
          fg: '#000000',
          highlight: '#ffffff',
          emphasis: '#000000',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'serif'],
      },
      fontSize: {
        'fluid-0': 'clamp(0.875rem, calc(0.8rem + 0.375vw), 1rem)',
        'fluid-1': 'clamp(1rem, calc(0.95rem + 0.25vw), 1.125rem)',
        'fluid-2': 'clamp(1.25rem, calc(1.15rem + 0.5vw), 1.5rem)',
        'fluid-3': 'clamp(1.5rem, calc(1.35rem + 0.75vw), 2rem)',
        'fluid-4': 'clamp(2rem, calc(1.6rem + 2vw), 3rem)',
        'fluid-5': 'clamp(2.5rem, calc(1.8rem + 3.5vw), 5rem)',
        'fluid-6': 'clamp(3rem, calc(2rem + 5vw), 6rem)',
      },
      spacing: {
        'fluid-gutter': 'clamp(1rem, 5vw, 4rem)',
        'fluid-gutter-sm': 'clamp(0.25rem, 3vw, 2rem)',
        'fluid-gutter-lg': 'clamp(1.5rem, 6vw, 5rem)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(180deg, #d16f00 0%, #5105a7 100%)',
        'line-break-left': 'linear-gradient(88deg, #d16f00 49%, #ffffff 50%)',
        'line-break-right': 'linear-gradient(-88deg, #5105a7 49%, #ffffff 50%)',
      },
      animation: {
        'reveal': 'reveal linear both',
        'slow-blink': 'slow-blink 1s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'bounce-custom': 'bounce-custom 2s infinite',
        'slide-in': 'slide-in linear both',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0.1', transform: 'translateZ(8rem) translateY(4rem) scale(0.97)' },
          to: { opacity: '1', transform: 'none' },
        },
        'slow-blink': {
          '50%': { opacity: '0' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'bounce-custom': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '40%': { transform: 'translateX(-50%) translateY(-20px)' },
          '60%': { transform: 'translateX(-50%) translateY(-5px)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(var(--from-x))' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      maxWidth: {
        'content': '1024px',
      },
      borderRadius: {
        '20': '20px',
      },
    },
  },
  plugins: [],
}
