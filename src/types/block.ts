export interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  visible: boolean;
  type?: "workspace" | "dashboard" | "analytics";
  title?: string;
  content?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export interface DraggableBlockProps {
  children: React.ReactNode;
  position: { x: number; y: number };
  onDrag: (x: number, y: number) => void;
  bounds?:
    | "parent"
    | { left: number; top: number; right: number; bottom: number };
  grid?: [number, number];
  zIndex?: number;
}

export interface ResizableBlockProps {
  children: React.ReactNode;
  width: number;
  height: number;
  onResize: (width: number, height: number) => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}
