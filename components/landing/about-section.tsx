"use client"

import { Badge } from "@/components/ui/badge"
import {
  Shield,
  UserCheck,
  Clock,
  Award,
  HeartPulse,
  Star,
} from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutSection() {
  return (
    <AnimatedSection className="relative py-20 md:py-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      {/* Glow Background Effects */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 -right-16 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl z-0" />

      <section id="about" className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-gradient-to-r from-green-200 to-green-400 text-green-800 hover:scale-105 shadow-md px-5 py-2 text-base font-semibold mb-4 transition-transform duration-300 ease-in-out rounded-full">
              About MediCare
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Leading Healthcare Excellence for Over{" "}
              <span className="text-blue-600">20 Years</span>
            </h2>
            <p className="text-gray-700 md:text-xl leading-relaxed mb-10">
              MediCare is dedicated to providing innovative, patient-centered healthcare with compassion and expertise.
              Our commitment to excellence and modern medical practices has made us a trusted name for thousands of families.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 justify-center mt-14"
          >
            {[
              {
                Icon: Shield,
                color: "bg-blue-500",
                title: "Advanced Technology",
                desc: "State-of-the-art equipment and digital records",
              },
              {
                Icon: UserCheck,
                color: "bg-green-500",
                title: "Expert Team",
                desc: "Qualified, caring doctors and staff",
              },
              {
                Icon: Clock,
                color: "bg-purple-500",
                title: "24/7 Support",
                desc: "Emergency care and patient help anytime",
              },
              {
                Icon: Award,
                color: "bg-orange-500",
                title: "Accredited & Trusted",
                desc: "Internationally recognized standards",
              },
            ].map(({ Icon, color, title, desc }, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center bg-white/90 hover:bg-blue-50 backdrop-blur-xl rounded-2xl px-6 py-10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`p-3 rounded-full text-white mb-4 shadow-lg ${color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2 text-center">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 text-center">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center justify-center gap-8 mt-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <HeartPulse className="h-7 w-7 text-pink-600" />
              <span className="text-lg font-semibold text-gray-800">
                5000+ Happy Patients
              </span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <Star className="h-7 w-7 text-yellow-400" />
              <span className="text-lg font-semibold text-gray-800">
                4.9/5 Patient Rating
              </span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <Shield className="h-7 w-7 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">
                20+ Years Experience
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  )
}
