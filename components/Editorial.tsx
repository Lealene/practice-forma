import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Stat } from "@/lib/site-data";

interface EditorialProps {
  stats: Stat[];
  image: string;
}

export default function Editorial({ stats, image }: EditorialProps) {
  return (
    <section id="our-story" className="bg-[#2F4338] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Left: Letter */}
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-cream-border mb-6">
            Our workshop
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight mb-8">
            We make less, so each piece can be more.
          </h2>

          <div className="space-y-6 text-gray-300 leading-8 max-w-lg">
            <p>
              Every FORMA piece begins as a single board of slow-grown European
              oak, cut by hand in our workshop outside Porto. Nothing leaves
              until it can survive a generation of ordinary life: spilled
              coffee, restless kids, the weight of an afternoon nap.
            </p>

            <p>
              No flat-pack shortcuts, no hidden particle board, no rush. When
              you buy a chair from us, you are buying the last chair of that
              kind you will need.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-12 pt-10 sm:pt-12 border-t border-[#41554A]">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 130} duration={700} offset={16}>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white">{stat.value}</p>
                <p className="text-sm text-gray-300 mt-2">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative h-72 sm:h-96 md:h-[480px] lg:h-[600px] bg-gray-200 overflow-hidden rounded-sm">
          <Image
            src={image}
            alt="FORMA workshop"
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
