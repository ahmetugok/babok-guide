/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                grotesk: ['"Space Grotesk"', 'monospace'],
            },
            colors: {
                void: {
                    DEFAULT: '#080B12',
                    50: '#0D1117',
                    100: '#0F172A',
                    200: '#1E293B',
                    300: '#334155',
                },
                neon: {
                    cyan: '#22d3ee',
                    crimson: '#f43f5e',
                    amethyst: '#a78bfa',
                },
            },
        },
    },
    plugins: [],
}
