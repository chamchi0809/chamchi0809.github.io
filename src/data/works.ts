export interface Work {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    tags?: string[];
    year?: string;
    role?: string;
    accent?: string;
}

export const works: Work[] = [
    {
        title: "Die:Algen",
        description: "2D action platformer game made with Unity.",
        url: "https://youtu.be/ZhOZ6S9JkKw?t=260",
        imageUrl: "/images/diealgen.webp",
        tags: ["Unity", "Game"],
        year: "2025",
        role: "Client Dev · VFX",
    },
    {
        title: "Your Planet",
        description: "Procedual planet generator made with webgl/react",
        url: "https://your-planet-generator.web.app/",
        imageUrl: "/images/your-planet.webp",
        tags: ["WebGL", "React", "Shaders"],
        year: "2022",
        role: "Design · Code",
        accent: "#9bbfd4",
    },
    {
        title: "CHAMCHI/DEV",
        description:
            "My personal site made with Astro, React, R3f and TailwindCSS.",
        url: "https://chamchi0809.github.io/",
        imageUrl: "/images/blog.webp",
        tags: ["Astro", "React", "R3F"],
        year: "2026",
        role: "Design · Code",
        accent: "#d4a574",
    },
    {
        title: "God Of Color",
        description:
            "A 3D action platformer game made with Unity. \n" +
            "Your fight 6 bosses and retrieve your power.",
        url: "https://seoshi1234.itch.io/goc",
        imageUrl: "/images/goc.png",
        tags: ["Unity", "C#", "Game"],
        year: "2022",
        role: "Client Dev · VFX",
        accent: "#c98a85",
    },
    {
        title: "TAPE",
        description:
            "TAPE is a brilliant puzzle game using layered video players to find certain time of image.",
        url: "https://seoshi1234.itch.io/tape",
        imageUrl: "/images/tape.png",
        tags: ["Unity", "Puzzle", "Game"],
        year: "2022",
        role: "Client Dev · VFX",
        accent: "#b8a8d4",
    },
];
