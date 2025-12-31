"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, ArrowUpRight } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  interest: string;
  message: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    interest: "Project Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Aquí puedes agregar la lógica de envío del formulario
    console.log("Form submitted:", formData);
    
    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative bg-black min-h-screen py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column - Info */}
          <motion.div className="flex flex-col" variants={itemVariants}>
            <span className="inline-block px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-gray-400 border border-gray-700 rounded-full w-fit mb-8">
              Get in touch
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Let&apos;s build
              <br />
              the <span className="text-gray-500">future.</span>
            </h2>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
              I specialize in engineering robust backend systems and crafting
              minimal, high-performance interfaces. Open for freelance and
              consulting.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Email
                  </p>
                  <a
                    href="mailto:cancinod080@gmail.com"
                    className="text-white text-sm hover:text-gray-300 transition-colors"
                  >
                    cancinod080@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Based in
                  </p>
                  <p className="text-white text-sm">Chile</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-gray-400 mb-4">Connect on Socials</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/diegitfk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-gray-500 hover:bg-gray-900 transition-all"
                >
                  <Github size={18} className="text-gray-400" />
                </a>
                <a
                  href="https://www.linkedin.com/in/diego-cancino-b19850294/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-gray-500 hover:bg-gray-900 transition-all"
                >
                  <Linkedin size={18} className="text-gray-400" />
                </a>
                <a
                  href="https://x.com/diegitfk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-gray-500 hover:bg-gray-900 transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-gray-400 fill-current"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs text-gray-500 uppercase tracking-wider mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs text-gray-500 uppercase tracking-wider mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="interest"
                  className="block text-xs text-gray-500 uppercase tracking-wider mb-2"
                >
                  Interest
                </label>
                <div className="relative">
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-gray-500 transition-colors cursor-pointer"
                  >
                    <option value="Project Inquiry" className="bg-black">
                      Project Inquiry
                    </option>
                    <option value="Freelance Work" className="bg-black">
                      Freelance Work
                    </option>
                    <option value="Consulting" className="bg-black">
                      Consulting
                    </option>
                    <option value="Job Opportunity" className="bg-black">
                      Job Opportunity
                    </option>
                    <option value="Other" className="bg-black">
                      Other
                    </option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs text-gray-500 uppercase tracking-wider mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors resize-none font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  I usually respond within 24 hours.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 border-t border-gray-800">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Diego Cancino. All rights reserved.
        </p>
      </div>
    </section>
  );
}
