"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const heroSections = [
  {
    id: "80e5a0ee-6fa7-429c-a299-019d38514e1d",
    title: "Shop Men",
    backgroundImage: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_800,w_800/soccer_fw25_intermiamijersey_tcc_launch_d_08374ebd49.jpg",
    gradient: "",
  },
  {
    id: "e04a81b1-9653-47f1-93da-9e14340c564d",
    title: "Shop Women",
    backgroundImage: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/ccbb1ce664ed490db1e6f5987a95abdf_9366/Essentials_3-Stripes_Full-Zip_Fleece_Hoodie_Grey_JE1285_21_model.jpg",
    gradient: "",
  },
  {
    id: "a454b1f9-b5b1-4e78-8d75-2ab7a7624873",
    title: "Shop Kids",
    backgroundImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&h=1200&fit=crop&crop=face",
    gradient: "",
  },
]

export default function HeroSection() {
  return (
    <section className="h-screen -top-10 w-full flex flex-col md:flex-row">
      {heroSections.map((section, index) => (
        <div
          key={section.id}
          className="relative flex-1 group overflow-hidden"
          style={{
            backgroundImage: `url(${section.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${section.gradient} transition-opacity duration-500 group-hover:opacity-80`}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end items-center p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 transform transition-transform duration-500 group-hover:scale-105">
                {section.title.split(" ")[1]}
              </h2>
            </div>

            {/* CTA Button */}
            <Link href={`/category/${section.id}`}>
              <button className="group/btn relative bg-white text-gray-900 px-8 py-4 font-semibold text-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1">
                <span className="flex items-center gap-3">
                  {section.title}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              </button>
            </Link>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ))}
    </section>
  )
}
