import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, Globe } from "lucide-react";
import { ToggleTheme } from "@/components/toggle-theme";

export function Footer() {
  return (
    <footer className="border-t absolute bottom-0 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex items-center gap-4">
          {/* <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Utkarsh Tripathi" />
            <AvatarFallback>YN</AvatarFallback>
          </Avatar> */}
          <div className="h-10 w-10">
            <img
              src="https://avatars.githubusercontent.com/u/83540694?v=4"
              alt="Utkarsh Tripathi"
              className="rounded-full h-10 w-10 object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-semibold">Utkarsh Tripathi</p>
            <p className="text-muted-foreground">Software Developer</p>
          </div>
          <ToggleTheme />
        </div>
        <div className="flex gap-4 flex-row align-middle justify-center">
          <Link
            href="https://github.com/utkarsh-1905"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/utkarsh1905/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="mailto:utripathi2002@gmail.com">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
          <Link
            href="https://utkarshtripathi.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Website</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
