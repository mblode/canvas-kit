import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, next, react],
  // Rules relaxed for this codebase after the Ultracite 7.9.3 / oxlint bump.
  // Each is a wide mechanical refactor with no safe autofix, or an intentional
  // pattern in this app; they're deferred rather than fixed ad hoc. Every other
  // Ultracite rule is enforced (real findings were fixed by hand). Keys sorted
  // to satisfy sort-keys.
  //
  // - react-compiler: React Compiler is enabled; its advisories (refs/effects/
  //   static components/memo deps) span dozens of demo and canvas components.
  // - func-style / no-use-before-define: hooks and helpers use `function`
  //   declarations throughout.
  // - no-unescaped-entities / prefer-named-capture-group: course prose in JSX
  //   and named-capture refactors are churn with no behavioural change.
  // - no-danger / no-react-children / hook-use-state / prefer-await-to-callbacks
  //   / callback-return / jsx-handler-names / prefer-export-from: intentional
  //   patterns (JSON-LD injection, React.Children, component-typed useState,
  //   callback-based storage utilities, barrel re-exports).
  rules: {
    "callback-return": "off",
    "func-style": "off",
    "hook-use-state": "off",
    "jsx-handler-names": "off",
    "no-danger": "off",
    "no-react-children": "off",
    "no-unescaped-entities": "off",
    "no-use-before-define": "off",
    "prefer-await-to-callbacks": "off",
    "prefer-export-from": "off",
    "prefer-named-capture-group": "off",
    "react-compiler": "off",
  },
});
