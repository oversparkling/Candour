module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'standard': "url('/bg.png')",
                'teal': "url('/bg_teal.png')",
                'green': "url('/bg_green.png')",
                'red': "url('/bg_red.png')",
            },
            colors: {
                black: {
                    900: '#3D4257',
                    800: '#747782',
                },
                blue: {
                    900: '#007AFF',
                },
                green: {
                    50: '#E1F7EC',
                    800: '#236C4D',
                    900: '#4BAE4F',
                },
            },
            fontFamily: {
                header: ["SF Pro Semibold"],
                prints: ["SF Pro Regular"],
                title: ["SF Pro Fullbold"],
            },
        },
    },
    plugins: [],
};
