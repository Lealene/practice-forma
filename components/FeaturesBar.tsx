import ScrollReveal from "./ScrollReveal";

interface FeaturesBarProps {
  features: string[];
}

export default function FeaturesBar({ features }: FeaturesBarProps) {
  return (
    <section
      id="materials"
      className="bg-background border-y border-cream-border scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm text-foreground">
          {features.map((feature, i) => (
            <ScrollReveal
              key={feature}
              delay={i * 90}
              duration={600}
              offset={12}
              className="flex items-center justify-center md:justify-start gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span>{feature}</span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}