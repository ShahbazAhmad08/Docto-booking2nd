"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Video, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

function HeroSection() {
  const { theme } = useTheme();

  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const descColor = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <section className="hero-gradient py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h1
            className={`text-5xl md:text-7xl font-bold ${textColor} mb-6 leading-tight`}
          >
            Your Health,
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Our Priority
            </span>
          </h1>
          <p
            className={`text-xl md:text-2xl ${descColor} mb-8 max-w-3xl mx-auto leading-relaxed`}
          >
            Connect with qualified doctors instantly. Book appointments, get
            online consultations, and take control of your health journey.
          </p>
        </div>

        {/* Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Find Doctor Nearby */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl font-bold">
                Find Doctor Nearby
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                Discover qualified doctors in your area with ratings and reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/find-doctors">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                  Explore Doctors
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Video Consultation */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl font-bold">
                Video Consultation
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                Get instant medical advice through secure video calls
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/consultations/video">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 group-hover:bg-white group-hover:text-emerald-600 transition-all duration-300">
                  Start Video Call
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Call Consultation */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl font-bold">
                Call Consultation
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                Quick medical consultation over phone calls
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/consultations/call">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 group-hover:bg-white group-hover:text-purple-600 transition-all duration-300">
                  Make a Call
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;

// "use client";
// import Image from "next/image";

// const HeroSection = () => {
//   return (
//     <section className="bg-[#1D0D32] text-orange-200 container mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen overflow-hidden">
//       <div className="pt-12 sm:pt-16 md:pt-24 lg:pt-48">
//         <h1 className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
//           Book your next <br /> healthcare <br /> appointment
//         </h1>
//         <br />
//         <button className="bg-orange-300 text-black font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-[#f8d88d] transition text-sm sm:text-base">
//           Meet our Specialist →
//         </button>
//       </div>

//       <div
//         className="relative
//           w-[240px] h-[240px]
//           sm:w-[320px] sm:h-[320px]
//           md:w-[420px] md:h-[420px]
//           lg:w-[520px] lg:h-[520px]
//           xl:w-[560px] xl:h-[560px]
//           mx-auto
//           mt-4 sm:mt-6 md:mt-8 lg:mt-10
//           translate-x-4 sm:translate-x-8 md:translate-x-12 lg:translate-x-16 xl:translate-x-20
//           -translate-y-2 sm:-translate-y-4 md:-translate-y-6 lg:-translate-y-8 xl:-translate-y-12"
//       >
//         {/* Orange Circle */}
//         <div
//           className="absolute
//             top-[-40px] sm:top-[-60px] md:top-[-70px] lg:top-[-80px] xl:top-[-100px]
//             left-1/2
//             -translate-x-1/2 -translate-y-1/2
//             w-[120px] h-[120px]
//             sm:w-[160px] sm:h-[160px]
//             md:w-[210px] md:h-[210px]
//             lg:w-[260px] lg:h-[260px]
//             xl:w-[280px] xl:h-[280px]
//             bg-orange-300 rounded-full z-0"
//         />

//         {/* Doctor Image */}
//         <Image
//           src="/doctor.png"
//           alt="Doctor"
//           width={360}
//           height={360}
//           className="absolute
//             left-1/2
//             -translate-x-1/2 -translate-y-1/2
//             z-10
//             object-cover
//             rounded-full
//             w-[150px] h-[150px]
//             sm:w-[200px] sm:h-[200px]
//             md:w-[260px] md:h-[260px]
//             lg:w-[320px] lg:h-[320px]
//             xl:w-[360px] xl:h-[360px]"
//         />
//       </div>

//       <div>
//         <p
//           className="absolute
//           bottom-44 sm:bottom-52 md:bottom-60 lg:bottom-68 xl:bottom-80
//           right-2 sm:right-4 md:right-6 lg:right-8 xl:right-10
//           text-xs sm:text-sm md:text-base
//           max-w-[180px] sm:max-w-[200px] md:max-w-xs
//           p-2 sm:p-3 md:p-4
//           z-10 leading-tight sm:leading-normal text-justify"
//         >
//           SIMPLY LOG ON TO A WEBSITE OR APP AND BOOK AN APPOINTMENT FROM
//           ANYWHERE, AT ANY TIME.
//         </p>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
