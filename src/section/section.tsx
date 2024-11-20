import './section.css';
import { createRef, ReactElement, useEffect, useState } from "react";
import * as CC from "../components/index";

// -------- CUSTOM SECTION COMPONENTS --------

const CUSTOM_COMPONENTS: { [key: string]: (props: {}) => ReactElement } = {
	"call": CC.Callout,
	"grid": CC.Grid,
	"list": CC.BulletList
};

const getNewSectionEvent = (contentEl: any = undefined) => (
	new CustomEvent("newSection", {
		bubbles: true,
		cancelable: true,
		detail: {
			contentEl: contentEl
		}
	})
);

const getRemoveSectionEvent = (secNum: number) => (
	new CustomEvent("removeSection", {
		bubbles: true,
		cancelable: true,
		detail: { secNum: secNum }
	})
);

// -------- SECTION COMPONENT --------

function SectionControls(props: {
	secRef: React.RefObject<HTMLDivElement>,	// reference to the section element being controlled
	secNum: number								// it's corresponding section number
}) {

	const removeSection = (e: React.MouseEvent<HTMLDivElement>) => {
		document.dispatchEvent(getRemoveSectionEvent(props.secNum));
	};

	const moveSection = (e: React.MouseEvent<HTMLDivElement>) => {
		// 1 - using secRef, get the section element
		const section = props.secRef.current;
		if (!section) return;
		section.style.position = "absolute";

		const move = (e: MouseEvent) => {
			section.style.left = e.clientX + "px";
			section.style.top = e.clientY + "px";
		};

		document.addEventListener("mousemove", move);
	};

	const stopMoving = (e: React.MouseEvent<HTMLDivElement>) => {
		// 1 - using secRef, get the section element
		const section = props.secRef.current;
		if (!section) return;
		// 2 - place the section in the new position
		section.style.position = "relative";
	}

	return (
		<div className="controls" contentEditable={false}>
			<div className="remove-section expand-control" onClick={removeSection}>X</div>
			<div className="move-section" onMouseDown={moveSection} onMouseUp={stopMoving}>
				<i className="fa fa-hand-rock-o expand-control"></i>
			</div>
		</div>
	)
};

export function Section(props: {
	secNum: number,
	children?: ReactElement,
	enableControls?: boolean
}) {

	const secRef = createRef<HTMLDivElement>();
	const enableControls = props.enableControls ?? true;

    const onKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// TODO: this should be implemented as a DFA machine to handle the different states

        // SHIFT+ENTER ==> NEW SECTION
		if (e.shiftKey && e.key === "Enter") {
            e.preventDefault(); // prevents the default behavior of inserting a newline
            console.log("shift+enter => new section");
            // signal to the parent that a new section should be created:
            e.target.dispatchEvent(getNewSectionEvent());
        }
		// ENTER (MAY) ==> EXECUTE COMMAND
		else if (e.key === "Enter") {

			const text = e.currentTarget.textContent;

			if (! text)
				return;

			// ####################### HEADINGS #######################

            if (text.endsWith("###") || text.endsWith("##") || text.endsWith("#")) {
				const numDashes = text.endsWith("###") ? 3 : text.endsWith("##") ? 2 : 1;
				// Set the font size based on the number of dashes
				e.currentTarget.style.fontSize = `${2.5 - 0.3 * numDashes}em`;
				// Prevents the default behavior of inserting a newline
                e.preventDefault();
				// Remove the last 3 characters
				e.currentTarget.textContent = text.slice(0, -numDashes);

				return;
            }

			// ####################### CUSTOM COMPONENTS #######################

			const commandMatch = text.match(/\/\S+$/);	// match for "/<someWord>"
			if (commandMatch) {
				const cmd = commandMatch[0].slice(1);	// remove the leading "/"
				const CustomComponent = CUSTOM_COMPONENTS[cmd];
				if ( CustomComponent ) {
					// the command is valid, so create a new section with the custom component
					e.target.dispatchEvent(getNewSectionEvent(<CustomComponent/>));
					e.currentTarget.textContent = text.slice(0, -commandMatch[0].length);
					return;
				}
			}
        }
		else if (e.key === " ") {
			console.log('space key pressed');
			const text = e.currentTarget.textContent;
			console.log('text = ', text);
			if (! text) return;
			if (text === "-") {
				e.target.dispatchEvent(getNewSectionEvent(<CC.BulletList/>));
				e.currentTarget.textContent = text.slice(0, -1);
			}
			return;
		}
		// ####################### NO COMMAND #######################
    };

    return (
        <div ref={secRef} className="section" id = {`section-${props.secNum}`}>
			{ enableControls ? <SectionControls secRef={secRef} secNum={props.secNum}/> : null }
			<div
				className="content"
				contentEditable={true}
				onKeyDownCapture={onKeyDownCapture}
			>
				{ props.children }
			</div>
		</div>
    );
};