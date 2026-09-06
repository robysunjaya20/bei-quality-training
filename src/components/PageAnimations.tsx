"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PageAnimations() {
  useGSAP(() => {
    
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      gsap.set(
        [
          "[data-hero]",
          "[data-hero-item]",
          "[data-line]",
          "[data-reveal]",
          "[data-card]",
          "[data-section]",
          "[data-cta]",
        ],
        {
          clearProps: "all",
        }
      );

      return;
    }

    const isMobile = window.matchMedia(
      "(max-width: 767px)"
    ).matches;

    /* HERO */

    const hero = document.querySelector("[data-hero]");

    if (hero) {
      const heroItems = hero.querySelectorAll(
        "[data-hero-item]"
      );

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      heroTimeline.fromTo(
        heroItems,
        {
          y: isMobile ? 18 : 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.55 : 0.7,
          stagger: isMobile ? 0.07 : 0.11,
        }
      );
    }

    /* BLUE LINE */

    const lines = document.querySelectorAll(
      "[data-line]"
    );

    lines.forEach((line) => {
      gsap.fromTo(
        line,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: isMobile ? 0.5 : 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    /* GENERAL REVEAL */

    const reveals = document.querySelectorAll(
      "[data-reveal]"
    );

    reveals.forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: isMobile ? 18 : 28,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.5 : 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    /* SECTION REVEAL */

    const sections = document.querySelectorAll(
      "[data-section]"
    );

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          y: isMobile ? 20 : 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.55 : 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 86%",
            once: true,
          },
        }
      );
    });

    /* CARDS */

    const cards = document.querySelectorAll(
      "[data-card-group]"
    );

    cards.forEach((group) => {
      const cardItems = group.querySelectorAll(
        "[data-card]"
      );

      if (!cardItems.length) return;

      gsap.fromTo(
        cardItems,
        {
          y: isMobile ? 22 : 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.45 : 0.6,
          stagger: isMobile ? 0.08 : 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 86%",
            once: true,
          },
        }
      );
    });

    /* CTA*/

    const ctas = document.querySelectorAll(
      "[data-cta]"
    );

    ctas.forEach((cta) => {
      const children = cta.querySelectorAll(
        "[data-cta-item]"
      );

      gsap.fromTo(
        cta,
        {
          y: isMobile ? 15 : 25,
          opacity: 0.2,
        },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.55 : 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cta,
            start: "top 88%",
            once: true,
          },
        }
      );

      if (children.length) {
        gsap.fromTo(
          children,
          {
            y: isMobile ? 10 : 18,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.4 : 0.55,
            stagger: isMobile ? 0.06 : 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cta,
              start: "top 84%",
              once: true,
            },
          }
        );
      }
    });

    /* Refresh ScrollTrigger setelah semua animasi dibuat.*/

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });

  return null;
}