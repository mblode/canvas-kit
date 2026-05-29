"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";

const DragCard = ({
  hasMomentum,
  label,
}: {
  hasMomentum: boolean;
  label: string;
}) => {
  const constraintRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 40, stiffness: 400 });
  const displayX = hasMomentum ? springX : x;
  const rotate = useTransform(displayX, [-100, 100], [-8, 8]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <div
        ref={constraintRef}
        className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted/20"
      >
        <motion.div
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.1}
          dragMomentum={hasMomentum}
          style={{ rotate, x: displayX }}
          className="flex size-16 cursor-grab items-center justify-center rounded-lg border border-border bg-background shadow-md active:cursor-grabbing"
        >
          <span className="text-xs text-foreground">Drag</span>
        </motion.div>
      </div>
    </div>
  );
};

export const NoMomentumDrag = () => (
  <DragCard hasMomentum={false} label="No momentum" />
);

export const MomentumDrag = () => (
  <DragCard hasMomentum label="With momentum" />
);

const AVATARS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const AvatarGroup = ({
  distanceAware,
  label,
}: {
  distanceAware: boolean;
  label: string;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <div className="flex -space-x-2">
        {AVATARS.map((color, i) => {
          let y = 0;
          if (hovered !== null) {
            if (distanceAware) {
              const distance = Math.abs(i - hovered);
              if (distance === 0) {
                y = -8;
              } else if (distance === 1) {
                y = -4;
              }
            } else {
              y = i === hovered ? -8 : 0;
            }
          }

          return (
            <motion.div
              key={color}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              animate={{ y }}
              transition={
                distanceAware
                  ? { damping: 25, stiffness: 400, type: "spring" }
                  : { duration: 0.15 }
              }
              style={{ backgroundColor: color }}
              className="relative z-10 flex size-9 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
            >
              {String.fromCodePoint(65 + i)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const FlatHoverAvatarGroup = () => (
  <AvatarGroup distanceAware={false} label="Single lift" />
);

export const DistanceAwareAvatarGroup = () => (
  <AvatarGroup distanceAware label="Distance-aware" />
);
