import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface AnalysisBlock {
  title: string;
  content: string[];
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

  const renderBlock = (block: AnalysisBlock) => (
    <motion.div variants={item}>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{block.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {block.content.map((point, index) => (
              <li key={index} className="text-zinc-300">
                {point}
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
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      {renderBlock(analysis.overview)}
      <Separator className="my-6" />
      {renderBlock(analysis.risks)}
      <Separator className="my-6" />
      {renderBlock(analysis.settlement)}
      <Separator className="my-6" />
      {renderBlock(analysis.strategy)}
    </motion.div>
  );
};