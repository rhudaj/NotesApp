import type { CSSProperties, FC } from "react";
import { memo, useEffect, useState } from "react";

import { Box } from "./Box";

const styles: CSSProperties = {
    display: "inline-block",
    transform: "rotate(-7deg)",
    WebkitTransform: "rotate(-7deg)",
    opacity: 0.5,
};

export interface BoxDragPreviewProps {
    id: string;
}

/**
 * What's inside the box is up to you
 */
export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(
    function BoxDragPreview({ id }) {
        return (
            <div style={styles}>
                <Box id={id} />
            </div>
        );
    }
);
