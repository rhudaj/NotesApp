import type { CSSProperties, FC } from "react";
import { memo, useEffect } from "react";
import type { DragSourceMonitor } from "react-dnd";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { Box } from "./Box";
import { ItemTypes } from "./ItemTypes";

function getStyles(
    left: number,
    top: number,
    isDragging: boolean,
    isHovered: boolean
): CSSProperties {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    const hoverStyles = isHovered ? {
        padding: "1rem",
        border: "1px dashed gray",
    } : {};

    return {
        ...hoverStyles,
        width: 300,
        position: "absolute",
        transform,
        WebkitTransform: transform,
        // Hide the real node using CSS when dragging, cuz IE will ignore our custom "empty image" drag preview:
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : "",
    };
}

export interface DraggableBoxProps {
    id: string;
    left: number;
    top: number;
    component: any;
}

/**
 * Wraps a <Box> to make it draggable.
 */
export const DraggableBox: FC<DraggableBoxProps> = memo(function DraggableBox({ id, left, top, component }) {

    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.BOX,
            item: { id, left, top },
            collect: (monitor: DragSourceMonitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [id, left, top]
    );

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, []);

    return (
        <div style={getStyles(left, top, isDragging, false)}>
            <div ref={drag} className="drag-handle" style={{cursor: "move"}}>≡</div>
            <Box id={id}>
                {component}
            </Box>
        </div>
    );
});
