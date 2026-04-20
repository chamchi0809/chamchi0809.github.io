import { useEffect, useRef, useState } from "react";

export interface SectionLabelProps {
    title?: string;
    count?: number | string;
    meta?: string;
}

export default function SectionLabel({
    title = "More Works",
    count,
    meta,
}: SectionLabelProps) {
    const ref = useRef<HTMLDivElement>(null);
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
            { threshold: 0.2 },
        );
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={ref} className="flex items-end justify-between gap-6 w-full">
            <div className="flex flex-col gap-2 min-w-0">
                <h2
                    className="font-thunder-hc font-bold text-bright text-[44px] leading-[0.95] tracking-[-0.02em]"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible
                            ? "translateY(0)"
                            : "translateY(14px)",
                        transition:
                            "opacity 900ms ease-out 200ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 200ms",
                    }}
                >
                    {title}
                </h2>
            </div>

            {meta && (
                <span
                    className="text-[10px] font-mono uppercase tracking-[0.3em] text-bright/40 whitespace-nowrap pb-2"
                    style={{
                        opacity: visible ? 1 : 0,
                        transition: "opacity 700ms ease-out 500ms",
                    }}
                >
                    {meta}
                </span>
            )}
        </div>
    );
}
