"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-6 py-12 grid gap-10 md:grid-cols-4 text-center md:text-left">

        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold">BookFlow</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Simplifying book production workflow for modern teams.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 justify-center md:justify-start">
            <SocialIcon icon={<Facebook />} />
            <SocialIcon icon={<Instagram />} />
            <SocialIcon icon={<Linkedin />} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground items-center md:items-start flex flex-col">
            <li><a href="#" className="hover:text-primary">Home</a></li>
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground items-center md:items-start flex flex-col">
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
            <li><a href="#" className="hover:text-primary">Support</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-3">Newsletter</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get product updates & news.
          </p>

          <div className="flex gap-2 justify-center md:justify-start">
            <Input placeholder="Enter your email" />
            <Button size="icon">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BookFlow. All rights reserved.
      </div>
    </footer>
  )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white cursor-pointer transition">
      {icon}
    </div>
  )
}