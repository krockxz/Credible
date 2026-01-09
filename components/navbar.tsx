"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">C</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">Credible</span>
        </div>

        <div className="flex items-center gap-2">
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
