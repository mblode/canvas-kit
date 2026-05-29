export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

/** A styled API reference table for a component's props. */
export const PropsTable = ({ rows }: { rows: PropRow[] }) => (
  <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="bg-foreground/[0.03]">
          <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
            Prop
          </th>
          <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
            Type
          </th>
          <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
            Default
          </th>
          <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="border-border border-t align-top" key={row.name}>
            <td className="px-4 py-3 font-mono text-[0.8125rem]">
              <span className="text-foreground">{row.name}</span>
              {row.required ? (
                <span className="ml-1 text-destructive">*</span>
              ) : null}
            </td>
            <td className="px-4 py-3 font-mono text-[0.8125rem] text-blue-600 dark:text-blue-400">
              {row.type}
            </td>
            <td className="px-4 py-3 font-mono text-[0.8125rem] text-muted-foreground">
              {row.default ?? "—"}
            </td>
            <td className="px-4 py-3 text-[0.8125rem] text-muted-foreground leading-relaxed">
              {row.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
