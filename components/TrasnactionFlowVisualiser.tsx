import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import ExecuteButton from "./ExecuteButton";

interface TransactionFlowVisualizerProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
}

const calculateEstimates = (
  blocks: BlockType[]
): { totalGas: number; totalTime: number } => {
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
            <span className="opacity-75">{key}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const getFlowStatus = (
    blocks: BlockType[]
  ): {
    message: string;
    type: "warning" | "success" | "error";
  } => {
    const lastBlock = blocks[blocks.length - 1];

    if (lastBlock.category === "bridge") {
      return {
        message:
          "This flow ends with a bridge operation, which may require additional confirmation steps.",
        type: "warning",
      };
    }

    if (lastBlock.category === "defi") {
      return {
        message: "DeFi operations may be subject to slippage and price impact.",
        type: "warning",
      };
    }

    return {
      message: "This transaction flow is ready to be executed.",
      type: "success",
    };
  };

  return (
    <div className="space-y-6">
      {blocks.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blocks.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total operations in flow
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Est. Gas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalGas.toFixed(3)} ETH
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated total gas fees
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Est. Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTime} min</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated completion time
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transaction Flow</CardTitle>
              <ExecuteButton blocks={blocks} values={values} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {blocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`p-4 rounded-lg bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex-1`}
                    >
                      <div className="flex items-center gap-2">
                        <block.icon size={16} className="text-black" />
                        <span className="font-medium">{block.name}</span>
                      </div>
                      {renderBlockValues(index)}
                    </div>
                    {index < blocks.length - 1 && (
                      <ArrowRightLeft className="text-black" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{getFlowStatus(blocks).message}</AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default TransactionFlowVisualizer;
