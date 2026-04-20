export interface MarqueeProps {
    items?: string[];
    separator?: string;
    speed?: number;
    direction?: "left" | "right";
    italic?: boolean;
    size?: "sm" | "md" | "lg";
}

const DEFAULTS: Required<MarqueeProps> = {
    items: [
        "Interactive",
        "WebGL",
        "Unity",
        "React",
        "Shaders",
        "Games",
        "Tools",
        "Toys",
    ],
    separator: "✦",
    speed: 40,
    direction: "left",
    italic: true,
    size: "lg",
};

const sizeMap = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl",
};

export default function Marquee(props: MarqueeProps) {
    const { items, separator, speed, direction, italic, size } = {
        ...DEFAULTS,
        ...props,
    };
    const track = [...items, ...items];

    return (
        <section
            className="relative w-full overflow-hidden border-y border-bright/10 py-6"
            style={{
                maskImage:
                    "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
            }}
        >
            <div
                className={`flex whitespace-nowrap ${direction === "left" ? "animate-marqueeLeft" : "animate-marqueeRight"}`}
                style={{ animationDuration: `${speed}s` }}
            >
                {track.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-8 px-6 shrink-0"
                    >
                        <span
                            className={`font-thunder-lc font-bold tracking-tight text-bright/90 ${sizeMap[size]} ${italic ? "italic" : ""}`}
                        >
                            {item}
                        </span>
                        <span className="text-bright/30 text-2xl leading-none select-none">
                            {separator}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
