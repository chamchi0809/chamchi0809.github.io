import { useEffect, useState } from "react";

export interface WorksHeroProps {
    eyebrow?: string;
    title?: string;
    year?: string;
    location?: string;
}

const DEFAULTS: Required<WorksHeroProps> = {
    eyebrow: "WORKS",
    title: "WORKS",
    year: "2020 — 2026",
    location: "SEOUL · KR",
};

export default function WorksHero(props: WorksHeroProps) {
    const { eyebrow, title, year, location } = {
        ...DEFAULTS,
        ...props,
    };
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <section className="relative w-full pt-10">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <span
                        className="block h-[1px] bg-bright/50 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                            width: mounted ? "2.5rem" : "0rem",
                            transition:
                                "width 1100ms cubic-bezier(0.16,1,0.3,1)",
                        }}
                    />
                    <span
                        className="text-[10px] font-mono uppercase tracking-[0.35em] text-bright/60"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transition: "opacity 700ms ease-out 400ms",
                        }}
                    >
                        {eyebrow}
                    </span>
                </div>
                <div
                    className="flex items-center gap-2 text-[10px] font-mono text-bright/40 tracking-widest"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transition: "opacity 700ms ease-out 600ms",
                    }}
                >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-bright/60 animate-blink" />
                    <span>{location}</span>
                    <span className="text-bright/20">/</span>
                    <span>{year}</span>
                </div>
            </div>

            <h1
                className="font-thunder-hc font-bold text-bright leading-[0.85] tracking-[-0.025em]"
                style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
            >
                <span className="block overflow-hidden">
                    {title.split("").map((char, i) => (
                        <span
                            key={i}
                            className="inline-block will-change-transform"
                            style={{
                                transform: mounted
                                    ? "translateY(0)"
                                    : "translateY(110%)",
                                transition:
                                    "transform 1200ms cubic-bezier(0.16,1,0.3,1)",
                                transitionDelay: `${200 + i * 55}ms`,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </span>
            </h1>
        </section>
    );
}
