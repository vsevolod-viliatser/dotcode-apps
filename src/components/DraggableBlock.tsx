"use client";

import { DraggableBlockProps } from "@/types/block";
import React, { useEffect, useRef, useState } from "react";

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  children,
  position,
  onDrag,
  bounds = "parent",
  grid = [10, 10],
  zIndex = 1,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const blockRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest(".resize-handle")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const rect = blockRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    document.addEventListener("mousemove", handleMouseMove as EventListener);
    document.addEventListener("mouseup", handleMouseUp as EventListener);
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDragging || !parentRef.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const blockRect = blockRef.current?.getBoundingClientRect();

    if (!blockRect) return;

    let newX = e.clientX - parentRect.left - dragOffset.x;
    let newY = e.clientY - parentRect.top - dragOffset.y;

    newX = Math.round(newX / grid[0]) * grid[0];
    newY = Math.round(newY / grid[1]) * grid[1];

    if (bounds === "parent") {
      const maxX = parentRect.width - blockRect.width;
      const maxY = parentRect.height - blockRect.height;

      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));
    } else if (typeof bounds === "object") {
      newX = Math.max(bounds.left, Math.min(bounds.right, newX));
      newY = Math.max(bounds.top, Math.min(bounds.bottom, newY));
    }

    onDrag(newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove as EventListener);
    document.removeEventListener("mouseup", handleMouseUp as EventListener);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );
      document.removeEventListener("mouseup", handleMouseUp as EventListener);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div ref={parentRef} className="relative w-full h-full">
      <div
        ref={blockRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex,
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableBlock;
