"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-6 py-12 grid gap-10 md:grid-cols-4 text-center md:text-left">

        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">BookFlow</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
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
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 items-center md:items-start flex flex-col">
            <li><a href="#" className="hover:text-primary dark:hover:text-primary">Home</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 items-center md:items-start flex flex-col">
            <li><a href="#" className="hover:text-primary dark:hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-primary">Terms</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-primary">Support</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Newsletter</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Get product updates & news.
          </p>

          <div className="flex gap-2 justify-center md:justify-start">
            <Input placeholder="Enter your email" className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
            <Button size="icon">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} BookFlow. All rights reserved.
      </div>
    </footer>
  )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-primary hover:text-white cursor-pointer transition">
      {icon}
    </div>
  )
}