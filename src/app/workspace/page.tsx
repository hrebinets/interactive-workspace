"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

const STORAGE_KEY = "blocks";

type Block = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};

const defaultBlocks: Block[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  x: 10 + i * 40,
  y: 10 + i * 40,
  width: 300,
  height: 100,
  zIndex: i + 1,
}));

export default function Workspace() {
  const [blocks, setBlocks] = useState(defaultBlocks);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setBlocks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  const bringToFront = (id: number) => {
    const maxZ = Math.max(...blocks.map((b) => b.zIndex));
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, zIndex: maxZ + 1 } : b))
    );
  };

  const updatePosition = (id: number, x: number, y: number) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, x, y } : b)));
  };

  const updateSize = (id: number, width: number, height: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, width, height } : b))
    );
  };

  const deleteBlock = (id: number) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const resetBlocks = () => {
    setBlocks(defaultBlocks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBlocks));
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center shadow-md">
        <Link
          href="/"
          className="text-lg font-medium hover:text-purple-300"
        >
          ← Back to Home
        </Link>
        <button
          onClick={resetBlocks}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white font-medium shadow"
        >
          Reset Workspace
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        {blocks.map((block) => (
          <Rnd
            key={block.id}
            size={{ width: block.width, height: block.height }}
            position={{ x: block.x, y: block.y }}
            onDragStop={(e, d) => updatePosition(block.id, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, pos) => {
              updateSize(block.id, ref.offsetWidth, ref.offsetHeight);
              updatePosition(block.id, pos.x, pos.y);
            }}
            bounds="parent"
            style={{ zIndex: block.zIndex }}
            onMouseDown={() => bringToFront(block.id)}
            minWidth={100}
            minHeight={100}
            className="absolute rounded-xl bg-white border border-gray-300 shadow-lg p-4 cursor-move select-none"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-700">Block {block.id}</p>
              <button
                onClick={() => deleteBlock(block.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg cursor-pointer"
                title="Delete block"
              >
                ✕
              </button>
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}
