import { blocks } from "@/constants/paths";
import { ArrowRightLeft } from "lucide-react";
import React, { useState } from "react";
import PuzzlePiece from "./PuzzlePiece";

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
      // Clean up values for removed and subsequent blocks
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
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Chain Preview</h3>
        <div className="flex flex-col gap-4">
          {/* Flow diagram */}
          <div className="flex items-center gap-2 flex-wrap">
            {blocks.map((block, index) => (
              <React.Fragment key={index}>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    block.color.split(" ")[0]
                  } text-white`}
                >
                  <div className="flex items-center gap-2">
                    <block.icon size={16} />
                    <span>{block.name}</span>
                  </div>
                  {values[block.id] && (
                    <div className="text-xs mt-1">
                      {Object.entries(values[block.id]).map(([key, value]) => (
                        <div key={key} className="opacity-80">
                          {key}: {value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {index < blocks.length - 1 && (
                  <ArrowRightLeft className="text-gray-400" size={16} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Chain details */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="font-medium mb-2">Chain Details:</div>
            <div>Type: {blocks.map((b) => b.category).join(" → ")}</div>
            <div>Steps: {blocks.length}</div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🧩 Blockchain Puzzle Builder
        </h1>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">
            Available Pieces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <PuzzlePiece
                key={block.id}
                block={block}
                onDragStart={handleDragStart(block)}
              />
            ))}
          </div>
        </div>

        {/* Building Area */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-xl min-h-[300px]"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Your Chain</h2>
          <div className="overflow-x-auto">
            <div className="inline-flex items-center p-4 min-h-[200px] min-w-min">
              <div className="flex items-center gap-3">
                {" "}
                {/* Increased gap */}
                {chainBlocks.map((block, index) => (
                  <div className="relative" key={`chain-${block.id}-${index}`}>
                    <PuzzlePiece
                      block={block}
                      isChainPiece={true}
                      isCompatible={
                        index === 0 ||
                        chainBlocks[index - 1].compatibleWith.includes(block.id)
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
            </div>
          </div>
        </div>
        {chainBlocks.length > 0 && (
          <ChainPreview blocks={chainBlocks} values={blockValues} />
        )}
      </div>
    </div>
  );
};

export default BlockchainPuzzle;
