/**
 * Shared geometry and timing constants for the folder card and its peek
 * subcomponents. Kept in one place so the masonry layout, the staggered
 * card transitions and the folder-front peel all stay in lockstep.
 */

import type * as React from "react";

export interface CardPosition {
  x: number;
  y: number;
}

export interface CanvasFolderItem {
  /** Stable id for the item, used as a React key and in the onOpen payload. */
  id: string;
  title: string;
  completed?: boolean;
}

export interface FolderOpenState {
  folderId: string;
  itemId: string;
  title: string;
  sourceRect: DOMRect;
}

/** Renders the preview body inside a raised peek card. */
export type RenderPreview = (
  item: CanvasFolderItem,
  ctx: { width: number; height: number; index: number }
) => React.ReactNode;

// Folder shell dimensions. The two SVG paths are drawn at a fixed aspect
// ratio; the rendered width drives everything else.
export const CARD_WIDTH = 260;
export const BACK_ASPECT = 791 / 941;
export const FRONT_ASPECT = 657 / 941;

// Masonry layout for the peeked preview cards.
export const PEEK_COL_WIDTH = 200;
export const PEEK_GAP = 12;
export const PEEK_COLS = 3;
export const PEEK_CARD_HEIGHT = 260;
export const GRID_WIDTH =
  PEEK_COLS * PEEK_COL_WIDTH + (PEEK_COLS - 1) * PEEK_GAP;

// Touch tap threshold (px), movement beyond this is a canvas pan, not a tap.
export const TAP_THRESHOLD = 10;

// Animation timing, shared by the CSS transitions and the motion front.
export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
export const DURATION = 0.4;
export const STAGGER = 0.03;
export const STACK_PEEK_AMOUNT = 68;

export const FRONT_TRANSITION = {
  duration: DURATION,
  ease: [0.22, 1, 0.36, 1] as const,
  type: "tween" as const,
};

export const BACK_PATH =
  "M0.268987 207.734C-0.203113 200.761 0.0902891 190.326 0.0881891 183.081L0.0870867 136.869L0.0945864 96.5204C0.101186 73.7044 -0.924514 53.4354 11.582 33.2224C21.159 17.7799 36.5495 6.84339 54.283 2.87989C70.7315 -0.890607 94.638 0.119896 111.888 0.131396L178.315 0.136394L235.165 0.122394C258.183 0.121894 278.223 -1.36361 299.786 8.97339C337.241 26.9279 364.934 67.8574 408.27 72.4744C425.948 74.3579 445.674 74.1644 463.505 74.1414L533.031 74.1359L775.555 74.1199L835.115 74.1064C849.165 74.1069 862.7 73.5919 876.695 75.2429C909.27 79.0854 931.536 99.8109 938.451 131.707C941.271 152.488 940.661 185.105 940.211 206.862C940.701 248.045 940.32 289.996 940.315 331.232L940.31 557.053V666.103C940.31 680.183 940.101 694.958 940.281 708.968C940.871 754.763 918.255 784.788 871.75 789.618C857 790.793 842.835 789.563 828.76 790.298C824.41 790.083 819.636 790.173 815.266 790.213C780.341 790.553 745.251 789.698 710.341 790.298C704.401 789.973 696.111 790.213 690.026 790.208C678.466 790.143 666.906 790.168 655.351 790.283C646.806 790.023 636.955 790.178 628.435 790.298C626.62 790.138 623.506 790.258 621.586 790.273C614.906 790.073 607.661 790.113 600.966 790.218C555.411 790.943 509.256 789.148 463.771 790.323L463.32 790.208L75.54 790.183C51.535 787.878 33.9235 784.578 17.1775 764.798C15.053 762.173 12.988 759.063 11.045 756.263C5.57214 744.213 4.64644 744.293 1.79264 730.518C1.51229 725.363 0.471486 720.423 0.378686 714.708C0.120936 698.838 0.216636 682.903 0.214536 667.033L0.210889 579.643L0.227689 372.869C0.230589 336.894 0.731436 299.606 0.132386 263.713C0.593886 245.486 0.0316867 226.178 0.268987 207.734Z";

export const FRONT_PATH =
  "M817.143 0.111206C835.233 0.103706 853.068 -0.437075 871.118 0.935425C914.053 4.2011 936.483 31.386 940.078 72.7938C940.568 113.977 940.188 155.928 940.183 197.164L940.178 422.985V532.035C940.178 546.115 939.967 560.89 940.147 574.899C940.737 620.694 918.123 650.72 871.618 655.55C856.868 656.725 842.703 655.494 828.628 656.229C824.278 656.014 819.503 656.104 815.133 656.144C780.208 656.484 745.118 655.629 710.208 656.229C704.268 655.904 695.978 656.145 689.893 656.14C678.333 656.075 666.773 656.1 655.218 656.215C646.673 655.955 636.823 656.109 628.303 656.229C626.488 656.069 623.373 656.19 621.453 656.205C614.773 656.005 607.528 656.044 600.833 656.149C555.278 656.874 509.123 655.08 463.638 656.255L463.188 656.14L75.4072 656.115C51.4022 653.81 33.7909 650.509 17.0449 630.729C14.9205 628.104 12.855 624.995 10.9121 622.195C5.43931 610.145 4.51389 610.225 1.66016 596.45C1.37981 591.295 0.338894 586.355 0.246094 580.64C-0.0116526 564.77 0.0841312 548.835 0.0820312 532.965L0.078125 445.575L0.0947266 238.801C0.0976271 202.826 0.59905 165.537 0 129.644C0.461486 111.418 -0.101556 92.1098 0.135742 73.6659C0.598091 71.058 0.818652 67.1065 1.13672 64.3856C5.3327 28.4873 31.5329 3.64713 67.5742 1.07996C84.6197 -0.134042 101.019 0.116658 118.163 0.113159L197.466 0.118042L454.373 0.117065L730.913 0.120972L817.143 0.111206Z";

/**
 * Lays out `count` preview cards into a fixed three-column masonry, always
 * filling the shortest column next. Returns each card's top-left position and
 * the total grid height (trailing gap removed).
 */
export const computeFixedMasonry = (count: number) => {
  const colHeights = Array.from({ length: PEEK_COLS }, () => 0);
  const positions: CardPosition[] = [];

  for (let i = 0; i < count; i += 1) {
    const col = colHeights.indexOf(Math.min(...colHeights));
    positions.push({
      x: col * (PEEK_COL_WIDTH + PEEK_GAP),
      y: colHeights[col],
    });
    colHeights[col] += PEEK_CARD_HEIGHT + PEEK_GAP;
  }

  const gridHeight = Math.max(...colHeights) - PEEK_GAP;

  return { gridHeight, positions };
};
