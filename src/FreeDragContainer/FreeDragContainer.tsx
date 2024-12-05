import type { FC } from "react";
import { useCallback, useState } from "react";
import { Container } from "./Container";
import { CustomDragLayer } from "./CustomDragLayer";
import { Editor } from "../editor/editor";

interface FreeDragContainerProps {
    children: any[];
}

/**
 * Wraps an array of any child components into a set of boxes
 * that will be placed and moved around freely within a container.
 */
export const FreeDragContainer: FC<FreeDragContainerProps> = ({ children }) => {

    // --------------------- STATE ---------------------

    // Turn the array of children into a map of boxes

    const hashKey = (index: number) => String.fromCharCode(97 + index);

    const boxMap = children.reduce((acc, child, index) => {
        acc[hashKey(index)] = {
            top: 20 + index * 5,
            left: 80 + index * 5,
        };
        return acc;
    }, {});

    // Turn the array of children into a map of components

    const componentMap = children.reduce((acc, child, index) => {
        acc[hashKey(index)] = child;
        return acc;
    }, {});

    // --------------------- CONTROLS ---------------------

    const [snapToGridOnDrop, setSnapToGridAfterDrop] = useState(false);
    const [snapToGridWhileDrag, setSnapToGridWhileDragging] = useState(false);

    const handleSnapToGridAfterDropChange = useCallback(() => {
        setSnapToGridAfterDrop(!snapToGridOnDrop);
    }, [snapToGridOnDrop]);

    const handleSnapToGridWhileDraggingChange = useCallback(() => {
        setSnapToGridWhileDragging(!snapToGridWhileDrag);
    }, [snapToGridWhileDrag]);

	function Controls() {
		return (
			<p>
                <label htmlFor="snapToGridWhileDragging">
                    <input
                        id="snapToGridWhileDragging"
                        type="checkbox"
                        checked={snapToGridWhileDrag}
                        onChange={handleSnapToGridWhileDraggingChange}
                    />
                    <small>Snap to grid while dragging</small>
                </label>
                <br />
                <label htmlFor="snapToGridAfterDrop">
                    <input
                        id="snapToGridAfterDrop"
                        type="checkbox"
                        checked={snapToGridOnDrop}
                        onChange={handleSnapToGridAfterDropChange}
                    />
                    <small>Snap to grid after drop</small>
                </label>
            </p>
		)
	}

    return (
        <div>
			<Controls />
			<Container snapToGrid={snapToGridOnDrop} boxMap={boxMap} componentMap={componentMap} />
            <CustomDragLayer snapToGrid={snapToGridWhileDrag} />
        </div>
    );
};

export default FreeDragContainer;
