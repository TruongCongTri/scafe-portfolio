import { Fragment } from "react";

// Renders a heading stored as an array of lines in the language files.
export function Lines({ lines }: { lines: string[] }) {
  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}
