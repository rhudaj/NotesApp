import React from "react";
import { Editor } from "../../editor/editor"

/**
 * A hidden block is holds an Editor component, and is only shown when desired.
 * It holds onta a reference to another component. When that component is clicked, the hidden block is shown below it.
 */
export function HiddenBlock(props: {
    ref: React.RefObject<HTMLElement>   // Reference to the component that will trigger the hidden block
}) {

    // Get the position of the reference element:
    const refElement = props.ref.current;
    if (!refElement) return null;
    const refRect = refElement.getBoundingClientRect();
    const [refX, refY] = [refRect.left, refRect.bottom];

    return (
        <div className="hidden-block" style={{
            position: "absolute",
            left: refX,
            top: refY,
        }}>
            <Editor editorKey="hidden-block-editor" />
        </div>
    );
}