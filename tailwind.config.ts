import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
	safelist: [
		'bg-brand',
		'bg-brand-light',
		'text-brand',
		'text-brand-light',
		'text-brand-lightest',
		'bg-alt',
		'bg-alt-light',
		'text-alt',
		'text-alt-light',
		'text-alt-lightest'
	],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				// brand: {
				// 	lightest: '#b3cde1',
				// 	light: '#4d89b9',
				// 	DEFAULT: '#00579b',
				// 	dark: '#003c7f',
				// 	darkest: '#002c6d'
				// },
				brand: {
					lightest: '#BBBEEE',
					light: '#8E93FF',
					DEFAULT: '#4A5DFE',
					dark: '#3814C5',
					darkest: '#271190'
				},
				alt: {
					lightest: '#fde68a',
					light: '#f59e0b',
					DEFAULT: '#d97706',
					dark: '#b45309',
					darkest: '#78350f'
				},
				gray: {
					50: '#ffffff',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#314156',
					800: '#1f2937',
					900: '#0f172a'
				},
				good: {
					0: '#bbf7d0',
					50: '#4ade80',
					100: '#15803d'
				},
				bad: {
					0: '#fecaca',
					50: '#f87171',
					100: '#991b1b'
				},
				neutral: {
					0: '#e2e8f0',
					50: '#64748b',
					100: '#1f2937'
				},
				warning: {
					0: '#fde68a',
					50: '#f59e0b',
					100: '#92400e'
				}
				// brand: {
				//   lightest: "#f9c4c7",
				//   light: "#f59da2",
				//   DEFAULT: "#ea3b44",
				//   dark: "#e1262d",
				//   darkest: "#db191f",
				// },
			},
			minHeight: {
				64: '16rem'
			},
			transitionProperty: {
				width: 'width'
			},
			animation: {
				fadeIn: 'fadeIn 0.2s ease-in-out',
				fadeOut: 'fadeOut 0.2s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				}
			}
		},
		fontFamily: {
			sans: ['Inter', 'Roboto', 'sans-serif'],
			body: ['Roboto', 'Open Sans', 'sans-serif'],
			mono: ['Fira Mono', 'monospace']
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
} satisfies Config;
