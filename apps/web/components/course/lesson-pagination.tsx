"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { Pagination } from "@/components/canvas-kit/pagination";
import type { PaginationItem } from "@/components/canvas-kit/pagination";

export type LessonPaginationItem = PaginationItem;

/** Course-flavoured Pagination wired to next/link for `href` items. */
export const LessonPagination = (
  props: Omit<ComponentProps<typeof Pagination>, "linkComponent">
) => <Pagination linkComponent={Link} {...props} />;
