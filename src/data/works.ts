interface Work {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
}

export const works: Work[] = [
    {
        title: "Your Planet",
        description: "Procedual planet generator made with webgl/react",
        url: "https://your-planet-generator.web.app/",
        imageUrl: "/images/your-planet.webp",
    },
    {
        title: "CHAMCHI/DEV",
        description: "My personal site made with Astro, React, R3f and TailwindCSS.",
        url: "https://chamchi0809.github.io/",
        imageUrl: "/images/blog.webp",
    },
    {
        title: "God Of Color",
        description: "A 3D action platformer game made with Unity. \n" +
            "Your fight 6 bosses and retrieve your power.",
        url: "https://seoshi1234.itch.io/goc",
        imageUrl: "/images/goc.png",
    },
    {
        title: "TAPE",
        description: "TAPE is a brilliant puzzle game using layered video players to find certain time of image.",
        url: "https://seoshi1234.itch.io/tape",
        imageUrl: "/images/tape.png",
    },
]