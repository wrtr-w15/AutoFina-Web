"use client";
import React from "react";
import { motion } from "framer-motion";
import theme from "@/themes/theme";

interface Project {
  title: string;
  description: string;
  technologies: string[];
}

interface ProjectsCarouselProps {
  projects: Project[];
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Blurred edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${theme.colors.background} 0%, transparent 100%)`,
        }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(270deg, ${theme.colors.background} 0%, transparent 100%)`,
        }}
      />

      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -100 * projects.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
        style={{
          width: `${projects.length * 2 * 100}%`,
        }}
      >
        {[...projects, ...projects].map((project, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-80 rounded-2xl p-6"
            style={{
              background: `linear-gradient(180deg, ${theme.colors.card} 0%, ${theme.colors.muted} 100%)`,
              boxShadow: theme.shadow.soft,
              border: `1px solid ${theme.colors.border}`,
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
                {project.title}
              </h3>
              <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: theme.colors.accent + "20",
                    color: theme.colors.accent,
                    border: `1px solid ${theme.colors.accent}40`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
