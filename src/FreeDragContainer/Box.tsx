import type { CSSProperties, FC } from "react";
import { memo } from "react";

const styles: CSSProperties = {
    border: "1px dashed gray",
    padding: "1rem",
    backgroundColor: "lightblue"
};

export interface BoxProps {
    id: any,
    children?: React.ReactNode;
}

/**
 * A Box holds whatever component(s) you want.
 */
export const Box: FC<BoxProps> = memo(function Box({ id, children }) {
    return (
        <div style={styles}>
            {children ?? id}
        </div>
    )
});
