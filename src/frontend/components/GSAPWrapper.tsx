'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GSAPWrapper() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 1. Text reveals: dynamic slide up and fade
    const revealTexts = document.querySelectorAll('.gsap-reveal-text');
    revealTexts.forEach((text) => {
      gsap.fromTo(
        text,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // 2. Luxury Image mask reveal: clip-path sliding reveal + scale effect
    const revealImages = document.querySelectorAll('.gsap-reveal-image');
    revealImages.forEach((img) => {
      gsap.fromTo(
        img,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 1.8,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: img,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // 3. Parallax scroll effect for details showcase images
    const parallaxContainers = document.querySelectorAll('.gsap-parallax');
    parallaxContainers.forEach((container) => {
      const img = container.querySelector('img');
      if (!img) return;

      gsap.fromTo(
        img,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    // 4. Staggered card reveals (for Services, Testimonials, etc.)
    const staggerContainers = document.querySelectorAll('.gsap-stagger-container');
    staggerContainers.forEach((container) => {
      const items = container.querySelectorAll('.gsap-stagger-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
