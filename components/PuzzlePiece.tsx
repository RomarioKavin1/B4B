import { X } from "lucide-react";
import BlockInput from "./BlockInput";

const PuzzlePiece: React.FC<{
  block: BlockType;
  isChainPiece?: boolean;
  isCompatible?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  position?: "first" | "middle" | "last";
  values?: Record<string, string>;
  onValueChange?: (key: string, value: string) => void;
  onRemove?: () => void;
}> = ({
  block,
  isChainPiece = false,
  isCompatible = true,
  onClick,
  onDragStart,
  position = "middle",
  values = {},
  onValueChange,
  onRemove,
}) => {
  // Calculate height based on inputs
  const baseHeight = 180;
  const inputHeight =
    isChainPiece && block.inputs ? block.inputs.length * 70 : 0;
  const totalHeight = baseHeight + inputHeight;
  const baseWidth = 240;
  const totalWidth = isChainPiece && block.inputs ? 280 : baseWidth;

  return (
    <div
      draggable={!isChainPiece}
      onDragStart={onDragStart}
      onClick={onClick}
      className={`
          relative 
    w-full
    ${isChainPiece ? "max-w-[280px]" : "max-w-[240px]"}
    min-w-[200px]
  
          transition-all
          duration-300
          ${
            !isChainPiece
              ? "cursor-grab active:cursor-grabbing hover:scale-105"
              : ""
          }
          ${!isCompatible && isChainPiece ? "opacity-50" : "opacity-100"}
        `}
    >
      <svg
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        height={isChainPiece ? totalHeight : baseHeight}
        viewBox={`0 0 ${totalWidth} ${isChainPiece ? totalHeight : baseHeight}`}
        className="drop-shadow-xl transition-transform"
      >
        <defs>
          <linearGradient
            id={`gradient-${block.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              className={`${block.color.split(" ")[0]} stop-color`}
            />
            <stop
              offset="100%"
              className={`${block.color.split(" ")[1]} stop-color`}
            />
          </linearGradient>

          {/* Define puzzle piece paths for different positions */}
          <path
            id="piece-first"
            d={`
              M 40 0
              H 180
              C 180 0, 200 0, 200 20
              V 60
              C 200 70, 220 70, 220 80
              C 220 90, 200 90, 200 100
              V 140
              C 200 160, 180 160, 180 160
              H 40
              C 40 160, 20 160, 20 140
              V 20
              C 20 0, 40 0, 40 0
              Z
            `}
          />

          <path
            id="piece-middle"
            d={`
              M 40 0
              H 180
              C 180 0, 200 0, 200 20
              V 60
              C 200 70, 220 70, 220 80
              C 220 90, 200 90, 200 100
              V 140
              C 200 160, 180 160, 180 160
              H 40
              C 40 160, 20 160, 20 140
              V 100
              C 20 90, 0 90, 0 80
              C 0 70, 20 70, 20 60
              V 20
              C 20 0, 40 0, 40 0
              Z
            `}
          />

          <path
            id="piece-last"
            d={`
              M 40 0
              H 180
              C 180 0, 200 0, 200 20
              V 140
              C 200 160, 180 160, 180 160
              H 40
              C 40 160, 20 160, 20 140
              V 100
              C 20 90, 0 90, 0 80
              C 0 70, 20 70, 20 60
              V 20
              C 20 0, 40 0, 40 0
              Z
            `}
          />
        </defs>

        {/* Main puzzle piece shape */}
        <use
          href={`#piece-${position}`}
          fill={`url(#gradient-${block.id})`}
          transform={
            isChainPiece
              ? `translate(20, 0) scale(${totalWidth / baseWidth}, ${
                  totalHeight / 180
                })`
              : undefined
          }
        />

        {/* Inner content container */}
        {/* Adjust foreignObject height for inputs */}
        <foreignObject
          x={isChainPiece ? "40" : "40"}
          y={isChainPiece ? "20" : "30"}
          width={isChainPiece ? totalWidth - 80 : baseWidth - 80}
          height={isChainPiece ? totalHeight - 40 : baseHeight - 60}
        >
          <div className="w-full h-full flex flex-col items-center justify-start text-white">
            <block.icon size={32} className="mb-2" />
            <span className="font-bold text-sm mb-4 text-center truncate">
              {block.name}
            </span>

            {block.inputs && isChainPiece && (
              <div className="w-full space-y-4">
                {block.inputs.map((input, idx) => (
                  <div key={idx} className="w-full px-4">
                    {" "}
                    {/* Increased padding */}
                    <label className="text-xs opacity-70 mb-1.5 block truncate">
                      {input.label}
                    </label>
                    <div className="relative">
                      <BlockInput
                        input={input}
                        value={values[input.label] || ""}
                        onChange={(value) =>
                          onValueChange?.(input.label, value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </foreignObject>
      </svg>
      {isChainPiece && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 
                      opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
export default PuzzlePiece;
