
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-legal-charcoal to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-legal-blue/10 via-background/5 to-background pointer-events-none" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <div className="flex justify-center mb-8">
              <Scale className="h-16 w-16 text-legal-gold" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-legal-offwhite">
              AI-Powered
              <span className="text-legal-gold"> Mediation </span>
              Intelligence
            </h1>
            <p className="mx-auto max-w-[800px] text-legal-gray md:text-xl lg:text-2xl mt-4">
              Transform complex case files into actionable mediation insights. Get instant analysis of settlement ranges, negotiation leverage points, and strategic recommendations.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm text-legal-gray">
              Trusted by leading mediation firms nationwide
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
