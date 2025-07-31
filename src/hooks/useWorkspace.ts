import { initialBlocks } from "@/app/mock/blocks";
import { Block } from "@/types/block";
import {
  addBlock as addBlockUtil,
  bringBlockToFront,
  calculateMaxZIndex,
  deleteBlock as deleteBlockUtil,
  getStoredBlocks,
  getVisibleBlocks,
  moveBlock as moveBlockUtil,
  resizeBlock as resizeBlockUtil,
  setStoredBlocks,
} from "@/utils/workspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWorkspace = () => {
  const queryClient = useQueryClient();

  // Query for workspace blocks
  const {
    data: blocks = initialBlocks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workspace-blocks"],
    queryFn: () => {
      const stored = getStoredBlocks();
      return stored.length > 0 ? stored : initialBlocks;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Mutation for updating blocks
  const updateBlocksMutation = useMutation({
    mutationFn: (newBlocks: Block[]) => {
      setStoredBlocks(newBlocks);
      return Promise.resolve(newBlocks);
    },
    onSuccess: (newBlocks) => {
      queryClient.setQueryData(["workspace-blocks"], newBlocks);
    },
  });

  // Mutation for resetting blocks
  const resetBlocksMutation = useMutation({
    mutationFn: () => {
      setStoredBlocks(initialBlocks);
      return Promise.resolve(initialBlocks);
    },
    onSuccess: () => {
      queryClient.setQueryData(["workspace-blocks"], initialBlocks);
    },
  });

  // Helper function to update blocks
  const updateBlocks = (updater: (blocks: Block[]) => Block[]) => {
    const currentBlocks =
      queryClient.getQueryData<Block[]>(["workspace-blocks"]) || initialBlocks;
    const newBlocks = updater(currentBlocks);
    updateBlocksMutation.mutate(newBlocks);
  };

  // Block manipulation functions
  const moveBlock = (id: number, x: number, y: number) => {
    updateBlocks((blocks) => moveBlockUtil(blocks, id, x, y));
  };

  const resizeBlock = (id: number, width: number, height: number) => {
    updateBlocks((blocks) => resizeBlockUtil(blocks, id, width, height));
  };

  const bringToFront = (id: number) => {
    updateBlocks((blocks) => bringBlockToFront(blocks, id));
  };

  const deleteBlock = (id: number) => {
    updateBlocks((blocks) => deleteBlockUtil(blocks, id));
  };

  const resetBlocks = () => {
    resetBlocksMutation.mutate();
  };

  const addBlock = (newBlock: Omit<Block, "id" | "zIndex">) => {
    updateBlocks((blocks) => addBlockUtil(blocks, newBlock));
  };

  const visibleBlocks = getVisibleBlocks(blocks);
  const maxZIndex = calculateMaxZIndex(blocks);

  return {
    blocks,
    visibleBlocks,
    maxZIndex,
    isLoading:
      isLoading ||
      updateBlocksMutation.isPending ||
      resetBlocksMutation.isPending,
    error,
    moveBlock,
    resizeBlock,
    bringToFront,
    deleteBlock,
    resetBlocks,
    addBlock,
    updateBlocksMutation,
    resetBlocksMutation,
  };
};
