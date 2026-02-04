import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";

const Hero = () => {
    const titleRef = useRef([]);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const bgVideoRef = useRef(null);
    const lightRef = useRef(null);
    const heroContentRef = useRef(null);

    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Parallax rotation
    const rotateX = useTransform(mouseY, [0, window.innerHeight], [15, -15]);
    const rotateY = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
    const springX = useSpring(rotateX, { stiffness: 100, damping: 15 });
    const springY = useSpring(rotateY, { stiffness: 100, damping: 15 });

    // Light follows cursor
    const lightX = useTransform(mouseX, [0, window.innerWidth], ["-10%", "10%"]);
    const lightY = useTransform(mouseY, [0, window.innerHeight], ["-5%", "5%"]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Title cinematic fade-in
            tl.from(titleRef.current, {
                opacity: 0,
                y: 80,
                scale: 1.15,
                filter: "blur(6px)",
                duration: 1.8,
                stagger: 0.25,
            });

            // Subtitle appears softly
            tl.from(
                subtitleRef.current,
                {
                    opacity: 0,
                    y: 40,
                    duration: 1.2,
                    ease: "power2.out",
                },
                "-=0.6"
            );

            // CTA reveal with pulse
            tl.from(
                ctaRef.current,
                {
                    opacity: 0,
                    scale: 0.85,
                    duration: 0.8,
                    ease: "back.out(1.8)",
                    boxShadow: "0 0 0 rgba(255,0,0,0)",
                },
                "-=0.3"
            ).to(ctaRef.current, {
                boxShadow: "0 0 50px rgba(255,0,0,0.45)",
                repeat: -1,
                yoyo: true,
                duration: 2.5,
                ease: "sine.inOut",
            });
        });

        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            ctx.revert();
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY, springX, springY]);

    return (
        <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black perspective-[1200px]">
            {/* Background video */}
            <motion.video
                ref={bgVideoRef}
                src="/inamaticBackground.mp4"
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    rotateX: springX,
                    rotateY: springY,
                    filter:
                        "contrast(1.25) brightness(0.85) saturate(1.1) sepia(0.05) blur(0.3px)",
                    transformOrigin: "center",
                }}
            />

            {/* Light overlay that moves with cursor */}
            <motion.div
                ref={lightRef}
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, transparent 60%)",
                    x: lightX,
                    y: lightY,
                    rotateX: springX,
                    rotateY: springY,
                }}
            />

            {/* Cinematic vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

            {/* Hero content */}
            <motion.div
                ref={heroContentRef}
                className="relative z-10 text-center px-6"
                style={{
                    rotateX: springX,
                    rotateY: springY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Title */}
                <motion.h1
                    className="text-4xl md:text-6xl font-extrabold tracking-wide text-white leading-tight"
                    style={{
                        textShadow:
                            "0 0 40px rgba(255,255,255,0.45), 0 0 70px rgba(255,255,255,0.25)",
                        transform: "translateZ(80px)",
                    }}
                >
                    <span ref={(el) => (titleRef.current[0] = el)} className="block uppercase">
                        Popcorn
                    </span>
                    <span ref={(el) => (titleRef.current[1] = el)} className="block uppercase">
                        Seats
                    </span>
                    <span ref={(el) => (titleRef.current[2] = el)} className="block uppercase text-white">
                        Action!
                    </span>
                </motion.h1>

            </motion.div>
        </section>
    );
};

export default Hero;
