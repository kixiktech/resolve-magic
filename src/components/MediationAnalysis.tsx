
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Scale, TrendingUp, HandshakeIcon, Gavel } from "lucide-react";

interface AnalysisBlock {
  title: string;
  content: string[];
  icon?: React.ReactNode;
}

interface MediationAnalysisProps {
  analysis: {
    overview: AnalysisBlock;
    risks: AnalysisBlock;
    settlement: AnalysisBlock;
    strategy: AnalysisBlock;
  };
}

export const MediationAnalysis = ({ analysis }: MediationAnalysisProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const renderBlock = (block: AnalysisBlock, icon: React.ReactNode) => (
    <motion.div variants={item}>
      <Card className="bg-legal-charcoal/50 backdrop-blur-sm border-legal-blue/20 hover:border-legal-gold/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="p-2 rounded-full bg-legal-blue/10 text-legal-gold">
            {icon}
          </div>
          <CardTitle className="text-xl text-legal-gold">{block.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {block.content.map((point, index) => (
              <li key={index} className="text-legal-offwhite flex items-start space-x-2">
                <span className="text-legal-gold mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto p-6 space-y-6"
    >
      {renderBlock(analysis.overview, <Scale className="h-6 w-6" />)}
      <Separator className="my-6 opacity-50 bg-legal-blue/20" />
      {renderBlock(analysis.risks, <TrendingUp className="h-6 w-6" />)}
      <Separator className="my-6 opacity-50 bg-legal-blue/20" />
      {renderBlock(analysis.settlement, <HandshakeIcon className="h-6 w-6" />)}
      <Separator className="my-6 opacity-50 bg-legal-blue/20" />
      {renderBlock(analysis.strategy, <Gavel className="h-6 w-6" />)}
    </motion.div>
  );
};
