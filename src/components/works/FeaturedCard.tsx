import { useEffect, useRef, useState } from "react";

export interface FeaturedCardProps {
    title: string;
    description: string;
    imageUrl: string;
    url?: string;
    tags?: string[];
    year?: string;
    role?: string;
    eyebrow?: string;
    index?: number;
    accent?: string;
    reverse?: boolean;
}

export default function FeaturedCard({
    title,
    description,
    imageUrl,
    url,
    tags = [],
    year,
    role,
    eyebrow = "FEATURED",
    index = 0,
    accent = "#d4a574",
    reverse = false,
}: FeaturedCardProps) {
    const ref = useRef<HTMLAnchorElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [parallax, setParallax] = useState(0);

    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.15 },
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!ref.current) return;
        let raf = 0;
        const onScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const vh = window.innerHeight || 800;
            const progress =
                1 - (rect.top + rect.height / 2) / (vh + rect.height / 2);
            setParallax(Math.max(-1, Math.min(1, progress * 2 - 1)));
        };
        const loop = () => {
            onScroll();
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    const number = String(index + 1).padStart(2, "0");

    return (
        <a
            ref={ref}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`group relative w-full flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10 items-start`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition:
                    "opacity 1100ms cubic-bezier(0.16,1,0.3,1), transform 1100ms cubic-bezier(0.16,1,0.3,1)",
            }}
        >
            {/* Left — visual */}
            <div className="relative w-full md:w-[58%] shrink-0 aspect-[4/3] overflow-hidden rounded-[14px] border border-bright/10 bg-bright/[0.03]">
                <div
                    ref={imgRef}
                    className="absolute inset-[-8%] bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: `translateY(${parallax * 18}px)`,
                    }}
                />
                {/* bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                {/* scanlines */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 3px)",
                    }}
                />

                {/* corner marks */}
                <Corner className="top-3 left-3" corners="tl" />
                <Corner className="top-3 right-3" corners="tr" />
                <Corner className="bottom-3 left-3" corners="bl" />
                <Corner className="bottom-3 right-3" corners="br" />

                {/* number badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-bright/80 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-bright/20">
                    <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: accent }}
                    />
                    <span>/ {number}</span>
                </div>

                {/* hover action */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-bright translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="block w-4 h-[1px] bg-bright" />
                        Open live
                    </span>
                    <span className="w-10 h-10 rounded-full border border-bright/40 bg-black/30 backdrop-blur-sm flex items-center justify-center text-bright translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="inline-block -rotate-45 transition-transform group-hover:rotate-0">
                            →
                        </span>
                    </span>
                </div>
            </div>

            {/* Right — content */}
            <div className="flex-1 min-w-0 flex flex-col gap-5 pt-2">
                {/* meta */}
                <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-bright/50">
                    <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{
                            background: accent,
                            boxShadow: `0 0 8px ${accent}`,
                        }}
                    />
                    <span>{eyebrow}</span>
                    {year && (
                        <>
                            <span className="text-bright/20">//</span>
                            <span>{year}</span>
                        </>
                    )}
                </div>

                {/* title */}
                <h2
                    className="font-thunder-hc font-bold text-bright leading-[0.92] tracking-[-0.02em] group-hover:text-amberink transition-colors duration-500"
                    style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}
                >
                    {title}
                </h2>

                {/* animated rule */}
                <div className="relative h-[1px] w-full bg-bright/10 overflow-hidden">
                    <span
                        className="absolute inset-y-0 left-0 block bg-bright/80 transition-[width] duration-[900ms] ease-out"
                        style={{
                            width: visible ? "40%" : "0%",
                            background: `linear-gradient(90deg, ${accent}, transparent)`,
                            transitionDelay: "200ms",
                        }}
                    />
                </div>

                {/* description */}
                <p className="text-bright/75 text-[15px] leading-[1.65] whitespace-pre-wrap font-light max-w-lg">
                    {description}
                </p>

                {/* tags + role */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    {role && (
                        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-bright/60 border border-bright/15 rounded-full">
                            {role}
                        </span>
                    )}
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-bright/70 border border-bright/15 rounded-full hover:border-bright/40 hover:text-bright transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <div className="inline-flex items-center gap-3 mt-3 text-xs font-mono uppercase tracking-[0.3em] text-bright">
                    <span className="relative">
                        <span>Visit project</span>
                        <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-bright transition-all duration-500 group-hover:w-full" />
                    </span>
                    <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                        →
                    </span>
                </div>
            </div>
        </a>
    );
}

function Corner({
    className,
    corners,
}: {
    className?: string;
    corners: "tl" | "tr" | "bl" | "br";
}) {
    const edges: Record<string, string> = {
        tl: "border-t border-l",
        tr: "border-t border-r",
        bl: "border-b border-l",
        br: "border-b border-r",
    };
    return (
        <span
            className={`absolute w-3 h-3 border-bright/70 ${edges[corners]} ${className ?? ""}`}
        />
    );
}
