"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="rounded-full border border-transparent dark:bg-black/50 dark:border-white/[0.2] bg-white/50 backdrop-blur-md shadow-input flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">C</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Credible</span>
          </div>

          {/* GitHub Button */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-muted/50 transition-colors"
          >
            <a
              href="https://github.com/krockxz/Credible"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
