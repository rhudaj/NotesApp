import type { CSSProperties, FC } from "react";
import type { XYCoord } from "react-dnd";
import { useDragLayer } from "react-dnd";
import { BoxDragPreview } from "./BoxDragPreview";
import { ItemTypes } from "./ItemTypes";
import { snapToGrid } from "./snapToGrid";

const layerStyles: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
};

function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null,
    isSnapToGrid: boolean
) {
    if (!initialOffset || !currentOffset) {
        return {
            display: "none",
        };
    }

    let { x, y } = currentOffset;

    if (isSnapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);
        x += initialOffset.x;
        y += initialOffset.y;
    }

    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform, // optional
    };
}

export interface CustomDragLayerProps {
    snapToGrid: boolean;
}

export const CustomDragLayer: FC<CustomDragLayerProps> = (props) => {
    const { itemType, isDragging, item, initOff, currOff } =
        useDragLayer((monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initOff: monitor.getInitialSourceClientOffset(),
            currOff: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
        }));

    function renderItem() {
		// depends on the DND item type
        switch (itemType) {
            case ItemTypes.BOX:
                return <BoxDragPreview id={item.id} />;
            default:
                return null;
        }
    }

    if (!isDragging) return null;
    return (
        <div style={layerStyles}>
            <div style={getItemStyles(initOff, currOff, props.snapToGrid)}>
                {renderItem()}
            </div>
        </div>
    );
};