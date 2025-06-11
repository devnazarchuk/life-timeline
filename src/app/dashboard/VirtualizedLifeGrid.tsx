import React, { useRef } from "react";
import { FixedSizeGrid as Grid, FixedSizeGrid } from "react-window";
import { useWindowSize } from "react-use";
import type { GridChildComponentProps } from 'react-window';

// Типи блоків (універсально)
type Block = Record<string, unknown>;

type Props<BlockType> = {
  blocks: BlockType[];
  minBlockSize: number; // px
  renderBlock: (block: BlockType) => React.ReactNode;
};

// Повертає кількість колонок для режиму (52/12/9)
function getCols(blocks: Block[]) {
  if (!blocks.length) return 1;
  if (blocks[0].type === "week") return 52;
  if (blocks[0].type === "month") return 12;
  if (blocks[0].type === "year") return 9; // 90/9=10 рядів
  return 1;
}

// Повертає кількість рядків для режиму
function getRows(blocks: Block[], cols: number) {
  return Math.ceil(blocks.length / cols);
}

const VirtualizedLifeGrid: React.FC<Props<Block>> = ({ blocks, minBlockSize, renderBlock }) => {
  const gridRef = useRef<FixedSizeGrid<unknown[]> | null>(null);
  const { width: winW, height: winH } = useWindowSize();

  // Визначаємо кількість колонок/рядів
  const cols = getCols(blocks);
  const rows = getRows(blocks, cols);

  // Розрахунок розміру блоку так, щоб сітка завжди влізала і була квадратною
  // Мінімальний розмір — minBlockSize
  const gridW = Math.min(winW * 0.98, cols * (minBlockSize + 8));
  const gridH = Math.min(winH * 0.7, rows * (minBlockSize + 8));
  const blockSize = Math.max(
    minBlockSize,
    Math.floor(Math.min(gridW / cols, gridH / rows))
  );
  const gap = 6;

  // Рендер клітини
  const Cell = ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
    const idx = rowIndex * cols + columnIndex;
    if (idx >= blocks.length) return null;
    // Додаємо gap через padding
    const s = style as React.CSSProperties;
    const cellStyle = {
      ...s,
      left: Number(s.left) + gap,
      top: Number(s.top) + gap,
      width: Number(s.width) - gap,
      height: Number(s.height) - gap,
    };
    return (
      <div style={cellStyle} className="relative flex items-center justify-center">
        {renderBlock(blocks[idx])}
      </div>
    );
  };

  // Центруємо сітку
  const gridContainerStyle: React.CSSProperties = {
    width: cols * blockSize + gap,
    height: rows * blockSize + gap,
    maxWidth: "100vw",
    maxHeight: "70vh",
    margin: "0 auto",
    position: "relative",
    display: "block",
  };

  return (
    <div style={gridContainerStyle} className="hide-scrollbar">
      <Grid
        ref={gridRef}
        columnCount={cols}
        rowCount={rows}
        columnWidth={blockSize}
        rowHeight={blockSize}
        width={cols * blockSize + gap}
        height={rows * blockSize + gap}
        itemData={blocks}
        // style={{ overflow: "auto" }}
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default VirtualizedLifeGrid; 