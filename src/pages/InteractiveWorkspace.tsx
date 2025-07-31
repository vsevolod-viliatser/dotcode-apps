"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import { snapPositionToGrid, snapSizeToGrid } from "@/utils/workspace";
import dynamic from "next/dynamic";
import React from "react";
import { Rnd } from "react-rnd";

const InteractiveWorkspace: React.FC = () => {
  const {
    visibleBlocks,
    isLoading,
    error,
    moveBlock,
    resizeBlock,
    bringToFront,
    deleteBlock,
    resetBlocks,
  } = useWorkspace();

  const handleDragStop = (id: number, x: number, y: number) => {
    const snappedPosition = snapPositionToGrid(x, y);
    moveBlock(id, snappedPosition.x, snappedPosition.y);
  };

  const handleResizeStop = (id: number, width: number, height: number) => {
    const snappedSize = snapSizeToGrid(width, height);
    resizeBlock(id, snappedSize.width, snappedSize.height);
  };

  const handleClick = (id: number) => {
    bringToFront(id);
  };

  const handleDelete = (id: number) => {
    deleteBlock(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-600">Error loading workspace</p>
          <p className="text-sm text-gray-500 mt-1">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Interactive Workspace
        </h1>
        <p className="text-gray-600">
          Drag, resize, and organize blocks in this interactive workspace. Click
          blocks to bring them to the front, and use the resize handles to
          adjust their size.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <button
            onClick={resetBlocks}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Reset to Defaults
          </button>
          <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">💡</span>
              <span>
                Click blocks to bring to front • Drag to move • Resize handles
                on corners
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Workspace Canvas
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {visibleBlocks.length} active blocks
          </p>
        </div>

        <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg m-6 overflow-hidden">
          {visibleBlocks.map((block) => (
            <Rnd
              key={block.id}
              default={{
                x: block.x,
                y: block.y,
                width: block.width,
                height: block.height,
              }}
              position={{ x: block.x, y: block.y }}
              size={{ width: block.width, height: block.height }}
              onDragStop={(e, d) => handleDragStop(block.id, d.x, d.y)}
              onResizeStop={(e, direction, ref) => {
                const width = parseInt(ref.style.width);
                const height = parseInt(ref.style.height);
                handleResizeStop(block.id, width, height);
              }}
              minWidth={100}
              minHeight={50}
              maxWidth={800}
              maxHeight={400}
              bounds="parent"
              grid={[10, 10]}
              style={{
                zIndex: block.zIndex,
              }}
              className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-lg flex flex-col items-center justify-center relative group cursor-move"
              onClick={() => handleClick(block.id)}
            >
              <div className="text-white text-center p-4">
                <div className="text-2xl font-bold mb-2">{block.id}</div>
                <div className="text-sm opacity-90">{block.title}</div>
                <div className="text-xs opacity-75 mt-1">{block.content}</div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(block.id);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center text-sm shadow-sm"
                title="Delete block"
              >
                ×
              </button>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(InteractiveWorkspace), {
  ssr: false,
});
