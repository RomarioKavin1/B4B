import { blocks } from "@/constants/paths";
import { ArrowRightLeft } from "lucide-react";
import React, { useState } from "react";
import PuzzlePiece from "./PuzzlePiece";
import TransactionFlowVisualizer from "./TrasnactionFlowVisualiser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const BlockchainPuzzle: React.FC = () => {
  const [chainBlocks, setChainBlocks] = useState<BlockType[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null);
  const [blockValues, setBlockValues] = useState<
    Record<string, Record<string, string>>
  >({});

  const handleValueChange = (blockId: string, key: string, value: string) => {
    setBlockValues((prev) => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        [key]: value,
      },
    }));
  };

  const removeBlock = (index: number) => {
    setChainBlocks((prev) => {
      const newBlocks = prev.filter((_, i) => i !== index);
      const newValues = { ...blockValues };
      for (let i = index; i < prev.length; i++) {
        delete newValues[`chain-${i}`];
      }
      setBlockValues(newValues);
      return newBlocks;
    });
  };

  const isCompatibleWithChain = (block: BlockType): boolean => {
    if (chainBlocks.length === 0) return true;
    const lastBlock = chainBlocks[chainBlocks.length - 1];
    return lastBlock.compatibleWith.includes(block.id);
  };

  const handleDragStart = (block: BlockType) => (e: React.DragEvent) => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock && isCompatibleWithChain(draggedBlock)) {
      setChainBlocks((prev) => [...prev, draggedBlock]);
    }
    setDraggedBlock(null);
  };

  const ChainPreview: React.FC<{
    blocks: BlockType[];
    values: Record<string, Record<string, string>>;
  }> = ({ blocks, values }) => {
    return (
      <Card className="mt-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-black font-bold">Chain Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="w-full whitespace-nowrap rounded-lg border-2 border-black p-1">
            <div className="flex items-center gap-4 p-4">
              {blocks.map((block, index) => (
                <React.Fragment key={index}>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-lg border-2 border-black bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
                      "transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <block.icon size={16} className="text-black" />
                      <span className="font-bold text-black">{block.name}</span>
                    </div>
                    {values[block.id] && (
                      <div className="text-xs mt-2 space-y-1">
                        {Object.entries(values[block.id]).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="text-gray-600 font-medium"
                            >
                              {key}: {value}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  {index < blocks.length - 1 && (
                    <ArrowRightLeft
                      className="text-black flex-shrink-0"
                      size={16}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="bg-gray-200" />
          </ScrollArea>

          <Card className="border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <CardContent className="p-4 space-y-2">
              <div className="font-bold text-black">Chain Details</div>
              <div className="text-sm font-medium text-gray-600">
                Type: {blocks.map((b) => b.category).join(" → ")}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Steps: {blocks.length}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDFA] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-black">
            🧩 Blockchain Puzzle Builder
          </h1>
          <p className="text-gray-600 font-medium text-lg">
            Drag and drop blocks to create your blockchain flow
          </p>
        </div>

        <Card className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-black font-bold text-2xl">
              Available Pieces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blocks.map((block) => (
                <PuzzlePiece
                  key={block.id}
                  block={block}
                  onDragStart={handleDragStart(block)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardHeader>
            <CardTitle className="text-black font-bold text-2xl">
              Your Chain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-black rounded-lg p-2">
              <ScrollArea className="w-full whitespace-nowrap rounded-lg p-4">
                <div className="flex items-center gap-6">
                  {chainBlocks.map((block, index) => (
                    <div
                      className="relative group transition-transform hover:translate-y-[-2px]"
                      key={`chain-${block.id}-${index}`}
                    >
                      <PuzzlePiece
                        block={block}
                        isChainPiece={true}
                        isCompatible={
                          index === 0 ||
                          chainBlocks[index - 1].compatibleWith.includes(
                            block.id
                          )
                        }
                        position={
                          index === 0
                            ? "first"
                            : index === chainBlocks.length - 1
                            ? "last"
                            : "middle"
                        }
                        values={blockValues[`chain-${index}`] || {}}
                        onValueChange={(key, value) =>
                          handleValueChange(`chain-${index}`, key, value)
                        }
                        onRemove={() => removeBlock(index)}
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="bg-gray-200" />
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {chainBlocks.length > 0 && (
          <TransactionFlowVisualizer
            blocks={chainBlocks}
            values={blockValues}
          />
        )}
      </div>
    </div>
  );
};

export default BlockchainPuzzle;
