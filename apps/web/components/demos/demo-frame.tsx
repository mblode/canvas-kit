"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DemoState = Record<string, unknown>;

interface DemoMessage {
  type: "demo:state";
  slug: string;
  state: DemoState;
}

const DemoStateContext = createContext<DemoState>({});

export const useDemoState = <T extends DemoState = DemoState>(): T =>
  useContext(DemoStateContext) as T;

export const DemoFrame = ({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) => {
  const [state, setState] = useState<DemoState>({});

  useEffect(() => {
    const onMessage = (event: MessageEvent<DemoMessage>) => {
      const { data } = event;
      if (!data || data.type !== "demo:state") {
        return;
      }
      if (data.slug !== slug) {
        return;
      }
      setState(data.state ?? {});
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [slug]);

  return (
    <DemoStateContext.Provider value={state}>
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </DemoStateContext.Provider>
  );
};
