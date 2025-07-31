"use client";

import { ResizableBlockProps } from "@/types/block";
import React, { useEffect, useRef, useState } from "react";

const ResizableBlock: React.FC<ResizableBlockProps> = ({
  children,
  width,
  height,
  onResize,
  minWidth = 100,
  minHeight = 50,
  maxWidth = 800,
  maxHeight = 400,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const blockRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setStartSize({ width, height });
    setStartPos({ x: e.clientX, y: e.clientY });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    let newWidth = startSize.width;
    let newHeight = startSize.height;

    if (deltaX !== 0) {
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startSize.width + deltaX)
      );
    }
    if (deltaY !== 0) {
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, startSize.height + deltaY)
      );
    }

    // Snap to 10px grid
    newWidth = Math.round(newWidth / 10) * 10;
    newHeight = Math.round(newHeight / 10) * 10;

    onResize(newWidth, newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={blockRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      }}
    >
      {children}

      {/* Resize handles */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-blue-500 opacity-50 hover:opacity-75"
        onMouseDown={handleMouseDown}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-blue-500 opacity-50 hover:opacity-75"
        onMouseDown={handleMouseDown}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize bg-blue-500 opacity-50 hover:opacity-75"
        onMouseDown={handleMouseDown}
      />
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize bg-blue-500 opacity-50 hover:opacity-75"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizableBlock;
