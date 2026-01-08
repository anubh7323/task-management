import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0a",
                foreground: "#ededed",
                primary: {
                    DEFAULT: "#8b5cf6", // Violet 500
                    hover: "#7c3aed", // Violet 600
                    foreground: "#ffffff",
                },
                card: {
                    DEFAULT: "#171717",
                    border: "#262626",
                },
                accent: {
                    DEFAULT: "#3b82f6", // Blue 500
                    foreground: "#ffffff",
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "glass-gradient": "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))",
            },
        },
    },
    plugins: [],
};
export default config;
