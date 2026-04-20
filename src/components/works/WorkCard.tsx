import { useEffect, useRef, useState } from "react";

export interface WorkCardProps {
    title: string;
    description: string;
    imageUrl: string;
    url?: string;
    tags?: string[];
    year?: string;
    role?: string;
    accent?: string;
    index?: number;
}

export default function WorkCard({
    title,
    description,
    imageUrl,
    url,
    tags = [],
    year,
    role,
    accent = "#dadacf",
    index = 0,
}: WorkCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ x: 50, y: 50 });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setCoords({ x, y });
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: -ny * 4, y: nx * 4 });
    };

    const handleLeave = () => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    const number = String(index + 1).padStart(2, "0");

    return (
        <div
            ref={ref}
            className="w-full"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition:
                    "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
                transitionDelay: `${index * 90}ms`,
            }}
        >
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onMouseMove={handleMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleLeave}
                className="group relative flex flex-col gap-4 p-4 rounded-[14px] border border-bright/10 bg-bright/[0.02] overflow-hidden hover:border-bright/30 will-change-transform"
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transformStyle: "preserve-3d",
                    transition:
                        "transform 420ms cubic-bezier(0.16,1,0.3,1), border-color 400ms",
                }}
            >
                {/* spotlight */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(420px circle at ${coords.x}% ${coords.y}%, ${accent}22, transparent 45%)`,
                    }}
                />

                {/* image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[10px] border border-bright/10">
                    <div
                        className="absolute inset-[-4%] bg-cover bg-center transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <div
                        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 3px)",
                        }}
                    />
                    <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-[0.25em] text-bright/80 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-bright/15">
                        / {number}
                    </div>
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px] transition-opacity duration-500"
                        style={{ opacity: hovered ? 1 : 0 }}
                    >
                        <span className="inline-flex items-center gap-2 text-bright text-xs font-mono uppercase tracking-[0.3em]">
                            <span className="block w-4 h-[1px] bg-bright" />
                            View Project
                            <span className="inline-block transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </span>
                    </div>
                </div>

                {/* text */}
                <div className="flex flex-col gap-2 relative z-10">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-thunder-hc text-[28px] font-medium leading-none text-bright tracking-tight truncate">
                            {title}
                        </h3>
                        {year && (
                            <span className="text-[10px] font-mono text-bright/40 tracking-[0.2em] mt-1 shrink-0">
                                {year}
                            </span>
                        )}
                    </div>

                    <div className="relative h-[1px] w-full bg-bright/10 overflow-hidden">
                        <span
                            className="absolute inset-y-0 left-0 block h-full transition-[width] duration-500"
                            style={{
                                width: hovered ? "100%" : "24%",
                                background: `linear-gradient(90deg, ${accent}, transparent)`,
                            }}
                        />
                    </div>

                    <p className="text-[13px] text-bright/55 leading-[1.55] line-clamp-2 whitespace-pre-wrap font-light">
                        {description}
                    </p>

                    {(tags.length > 0 || role) && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {role && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] text-bright/50 border border-bright/10">
                                    {role}
                                </span>
                            )}
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] text-bright/65 border border-bright/15 group-hover:border-bright/35 transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </a>
        </div>
    );
}
