import { Bitcoin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFDFA] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid grid-cols-10 gap-4 p-4 opacity-[0.02]">
        {Array.from({ length: 100 }).map((_, i) => (
          <Bitcoin key={i} size={24} className="text-black rotate-12" />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20">
        {/* Hero Section */}
        <div className="space-y-8 text-center">
          {/* Logo */}
          <div
            className={cn(
              "inline-flex items-center gap-3 px-6 py-3",
              "bg-white border-2 border-black rounded-2xl",
              "shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
              "hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
              "hover:translate-y-[-4px]",
              "transition-all duration-200",
              "mb-8"
            )}
          >
            <div className="relative">
              <Bitcoin size={48} className="text-orange-500" />
              <span className="absolute -top-1 -right-1 text-lg font-black">
                4
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-black text-3xl tracking-tight">
                Bitcoin4Babies
              </span>
              <span className="text-sm font-bold text-gray-500">b4b</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl font-black text-black max-w-3xl mx-auto leading-tight">
            Learn Bitcoin Like a Baby 👶
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Build your first Bitcoin transaction flow with our intuitive
            drag-and-drop interface. Perfect for learning how Bitcoin works!
          </p>

          {/* CTA Button */}
          <div className="flex justify-center gap-4 pt-8">
            <Link href="/home">
              <Button
                className={cn(
                  "bg-black text-white border-2 border-black rounded-xl",
                  "text-lg font-bold px-8 py-6",
                  "shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                  "hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]",
                  "hover:translate-y-[-4px]",
                  "transition-all duration-200",
                  "flex items-center gap-2"
                )}
              >
                Launch App
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
            {[
              {
                title: "Visual Learning",
                description:
                  "Understand Bitcoin transactions through interactive puzzle pieces",
              },
              {
                title: "Real-time Feedback",
                description:
                  "See exactly how your transaction flow works as you build it",
              },
              {
                title: "Beginner Friendly",
                description: "No coding required - just drag, drop, and learn",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white p-6 rounded-xl",
                  "border-2 border-black",
                  "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                  "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                  "hover:translate-y-[-2px]",
                  "transition-all duration-200"
                )}
              >
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-500 font-medium">
        Built for Bitcoin Babies
      </div>
    </div>
  );
};

export default LandingPage;
