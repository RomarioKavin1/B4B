import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const calculateEstimates = (blocks: BlockType[]): GasEstimates => {
  const estimates = blocks.reduce(
    (acc, block) => {
      switch (block.category) {
        case "bridge":
          return {
            totalGas: acc.totalGas + 0.005,
            totalTime: acc.totalTime + 15,
          };
        case "intent":
          return {
            totalGas: acc.totalGas + 0.002,
            totalTime: acc.totalTime + 5,
          };
        case "defi":
          return {
            totalGas: acc.totalGas + 0.003,
            totalTime: acc.totalTime + 3,
          };
        default:
          return {
            totalGas: acc.totalGas + 0.001,
            totalTime: acc.totalTime + 1,
          };
      }
    },
    { totalGas: 0, totalTime: 0 }
  );

  return estimates;
};

const TransactionFlowVisualizer: React.FC<TransactionFlowVisualizerProps> = ({
  blocks,
  values,
}) => {
  const { totalGas, totalTime } = calculateEstimates(blocks);

  const renderBlockValues = (blockIndex: number) => {
    const blockValue = values[`chain-${blockIndex}`];
    if (!blockValue) return null;

    return (
      <div className="mt-2 text-sm space-y-1">
        {Object.entries(blockValue).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-medium text-black/70">{key}:</span>
            <span className="font-mono font-bold">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const getFlowStatus = (blocks: BlockType[]) => {
    const lastBlock = blocks[blocks.length - 1];

    if (lastBlock.category === "bridge") {
      return {
        message:
          "This flow ends with a bridge operation, which may require additional confirmation steps.",
        icon: "⚠️",
      };
    }

    if (lastBlock.category === "defi") {
      return {
        message: "DeFi operations may be subject to slippage and price impact.",
        icon: "💱",
      };
    }

    return {
      message: "This transaction flow is ready to be executed.",
      icon: "✅",
    };
  };

  return (
    <div className="space-y-6">
      {blocks.length > 0 && (
        <>
          {/* Flow Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Steps",
                value: blocks.length,
                unit: "operations",
                icon: "🔢",
              },
              {
                title: "Est. Gas",
                value: totalGas.toFixed(3),
                unit: "ETH",
                icon: "⛽",
              },
              {
                title: "Est. Time",
                value: totalTime,
                unit: "min",
                icon: "⏱️",
              },
            ].map((stat) => (
              <Card
                key={stat.title}
                className={cn(
                  "bg-white border-2 border-black rounded-xl",
                  "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                  "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                  "hover:translate-y-[-2px]",
                  "transition-all duration-200"
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black flex items-center gap-2">
                    {stat.icon} {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">
                    {stat.value}{" "}
                    <span className="text-sm font-bold text-gray-500">
                      {stat.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Flow Visualizer */}
          <Card
            className={cn(
              "bg-white border-2 border-black rounded-xl",
              "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
              "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
              "hover:translate-y-[-2px]",
              "transition-all duration-200"
            )}
          >
            <CardHeader>
              <CardTitle className="font-black">Transaction Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {blocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-4 rounded-lg bg-white border-2 border-black flex-1",
                        "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                        "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                        "hover:translate-y-[-2px]",
                        "transition-all duration-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <block.icon size={16} className="text-black" />
                        <span className="font-bold text-black">
                          {block.name}
                        </span>
                      </div>
                      {renderBlockValues(index)}
                    </div>
                    {index < blocks.length - 1 && (
                      <ArrowRightLeft
                        size={20}
                        className="text-black flex-shrink-0 rotate-90 md:rotate-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Alert */}
          <div
            className={cn(
              "p-4 bg-white border-2 border-black rounded-xl",
              "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
              "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
              "hover:translate-y-[-2px]",
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{getFlowStatus(blocks).icon}</span>
              <p className="font-medium text-black">
                {getFlowStatus(blocks).message}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionFlowVisualizer;
