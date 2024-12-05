import update from "immutability-helper";
import type { CSSProperties, FC } from "react";
import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { DraggableBox } from "./DraggableBox";
import type { DragItem } from "./interfaces";
import { ItemTypes } from "./ItemTypes";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";

const styles: CSSProperties = {
    width: 900,
    height: 900,
    border: "1px solid black",
    position: "relative",
};

export interface BoxMap {
    [key: string]: { top: number; left: number };
}

export interface ContainerProps {
    snapToGrid: boolean,
    boxMap: BoxMap,
    componentMap: { [key: string]: any },
}


/**
 * Wraps a set of <DraggableBox>
 * Defines how they are placed, dropped and moved.
 */
export const Container: FC<ContainerProps> = ({ snapToGrid, boxMap, componentMap }) => {
    const [boxes, setBoxes] = useState<BoxMap>(boxMap);

    // When 'boxes' changes
    const moveBox = useCallback(
        (id: string, left: number, top: number) => {
            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: { left, top },
                    },
                })
            );
        },
        [boxes]
    );

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.BOX,
            drop(item: DragItem, monitor) {

                const delta = monitor.getDifferenceFromInitialOffset() as {
                    x: number;
                    y: number;
                };

                let left = Math.round(item.left + delta.x);
                let top = Math.round(item.top + delta.y);
                if (snapToGrid) {
                    [left, top] = doSnapToGrid(left, top);
                }

                moveBox(item.id, left, top);
                return undefined;
            },
        }),
        [moveBox]
    );

    return (
        <div ref={drop} style={styles}>
            {Object.keys(boxes).map((key) => (
                <DraggableBox
                    key={key}
                    id={key}
                    {...boxes[key]}
                    component={componentMap[key]}
                />
            ))}
        </div>
    );
};
