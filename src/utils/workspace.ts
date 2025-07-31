import { Block } from "@/types/block";

export const WORKSPACE_STORAGE_KEY = "workspace-blocks";

// Grid snapping utilities
export const snapToGrid = (value: number, gridSize: number = 10): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const snapPositionToGrid = (
  x: number,
  y: number,
  gridSize: number = 10
) => {
  return {
    x: snapToGrid(x, gridSize),
    y: snapToGrid(y, gridSize),
  };
};

export const snapSizeToGrid = (
  width: number,
  height: number,
  gridSize: number = 10
) => {
  return {
    width: snapToGrid(width, gridSize),
    height: snapToGrid(height, gridSize),
  };
};

// Z-index management
export const calculateMaxZIndex = (blocks: Block[]): number => {
  if (blocks.length === 0) return 1;
  return Math.max(...blocks.map((block) => block.zIndex)) + 1;
};

export const bringBlockToFront = (
  blocks: Block[],
  blockId: number
): Block[] => {
  const maxZIndex = calculateMaxZIndex(blocks);
  return blocks.map((block) =>
    block.id === blockId ? { ...block, zIndex: maxZIndex } : block
  );
};

// Block manipulation
export const moveBlock = (
  blocks: Block[],
  blockId: number,
  x: number,
  y: number
): Block[] => {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, x, y } : block
  );
};

export const resizeBlock = (
  blocks: Block[],
  blockId: number,
  width: number,
  height: number
): Block[] => {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, width, height } : block
  );
};

export const deleteBlock = (blocks: Block[], blockId: number): Block[] => {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, visible: false } : block
  );
};

export const addBlock = (
  blocks: Block[],
  newBlock: Omit<Block, "id" | "zIndex">
): Block[] => {
  const maxZIndex = calculateMaxZIndex(blocks);
  const newId = Math.max(...blocks.map((b) => b.id), 0) + 1;

  return [
    ...blocks,
    {
      ...newBlock,
      id: newId,
      zIndex: maxZIndex,
    },
  ];
};

// Local storage utilities
export const getStoredBlocks = (): Block[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const setStoredBlocks = (blocks: Block[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(blocks));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

// Block filtering and counting
export const getVisibleBlocks = (blocks: Block[]): Block[] => {
  return blocks.filter((block) => block.visible);
};

export const getBlockCount = (blocks: Block[]): number => {
  return blocks.length;
};

export const getVisibleBlockCount = (blocks: Block[]): number => {
  return getVisibleBlocks(blocks).length;
};

// Block validation
export const validateBlock = (block: Block): boolean => {
  return (
    block.id > 0 &&
    block.x >= 0 &&
    block.y >= 0 &&
    block.width > 0 &&
    block.height > 0 &&
    block.zIndex > 0 &&
    typeof block.visible === "boolean"
  );
};

export const validateBlocks = (blocks: Block[]): boolean => {
  return blocks.every(validateBlock);
};
