import './section.css';
import { createRef, ReactElement, useEffect, useState } from "react";
import * as CC from "../components/index";

// -------- CUSTOM SECTION COMPONENTS --------

const CUSTOM_COMPONENTS: { [key: string]: (props: {}) => ReactElement } = {
	"call": CC.Callout,
	"grid": CC.Grid,
	"list": CC.BulletList
};

/**
 * @param contentEl
 * The content element to be added to the new section.
 * If not provided, the new section will be empty.
*/
const getNewSectionEvent = (
	contentEl?: ReactElement,
) => (
	// TODO: the editor should be sending this event.
	new CustomEvent("newSection", {
		bubbles: true,
		cancelable: true,
		detail: {
			contentEl: contentEl
		}
	})
);

const getRemoveSectionEvent = (secKey: string) => (
	new CustomEvent("removeSection", {
		bubbles: true,
		cancelable: true,
		detail: { secKey: secKey }
	})
);

// -------- SECTION CONTROLS --------

function SectionControls(props: {
	secRef: React.RefObject<HTMLDivElement>,	// Reference to the section element being controlled
	secKey: string								// Unique key of the referenced section
}) {

	const removeSection = (e: React.MouseEvent<HTMLDivElement>) => {
		document.dispatchEvent(getRemoveSectionEvent(props.secKey));
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
	};

	return (
		<div className="controls" contentEditable={false}>
			<div className="remove-section expand-control" onClick={removeSection}>X</div>
			<div className="move-section" onMouseDown={moveSection} onMouseUp={stopMoving}>
				<i className="fa fa-hand-rock-o expand-control"></i>
			</div>
		</div>
	)
};

// -------- SECTION COMPONENT --------

const onKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
	// TODO: this should be implemented as a DFA machine to handle the different states

	const TXT = e.currentTarget.textContent;

	// SHIFT+ENTER ==> NEW SECTION
	if (e.shiftKey && e.key === "Enter") {
		e.preventDefault(); // prevents the default behavior of inserting a newline
		// signal to the parent that a new section should be created:
		e.target.dispatchEvent(getNewSectionEvent());
	}

	// LOOK FOR TEXT BASED ON COMMANDS

	if (! TXT) {
		return;
	}

	// ENTER (MAY) ==> EXECUTE COMMAND
	if (e.key === "Enter") {

		// ####################### HEADINGS #######################

		if (TXT.endsWith("###") || TXT.endsWith("##") || TXT.endsWith("#")) {
			const numDashes = TXT.endsWith("###") ? 3 : TXT.endsWith("##") ? 2 : 1;
			// Set the font size based on the number of dashes
			e.currentTarget.style.fontSize = `${2.5 - 0.3 * numDashes}em`;
			// Prevents the default behavior of inserting a newline
			e.preventDefault();
			// Remove the last 3 characters
			e.currentTarget.textContent = TXT.slice(0, -numDashes);

			return;
		}

		// ####################### CUSTOM COMPONENTS #######################

		const commandMatch = TXT.match(/\/\S+$/);	// match for "/<someWord>"
		if (commandMatch) {
			const cmd = commandMatch[0].slice(1);	// remove the leading "/"
			const CustomComponent = CUSTOM_COMPONENTS[cmd];
			if ( CustomComponent ) {
				// the command is valid, so create a new section with the custom component
				e.target.dispatchEvent(getNewSectionEvent(<CustomComponent/>));
				e.currentTarget.textContent = TXT.slice(0, -commandMatch[0].length);
				return;
			}
		}
	}
	// ####################### BULLET LIST #######################
	else if (e.key === " ") {
		if (TXT === "-") {
			e.target.dispatchEvent(getNewSectionEvent(<CC.BulletList/>));
			e.currentTarget.textContent = TXT.slice(0, -1);
		}
		return;
	}
	// ####################### NO COMMAND #######################
};

interface SectionProps {
	children?: ReactElement,
	enableControls?: boolean,
	secKey: string
};

/*
	In order to set the key (used internally by react) of a component
	we need to wrap it in a factory function that accepts the key as a prop
*/

export function Section(props: SectionProps) {

	// Section controls are ENABLED by DEFAULT
	const enableControls = props.enableControls ?? true;

	// For the parent to be able to reference this section
	const secRef = createRef<HTMLDivElement>();

    return (
        <div ref={secRef} className="section">

			{ enableControls ? <SectionControls secRef={secRef} secKey={props.secKey}/> : null }

			<div className="content"
				contentEditable={true}
				onKeyDownCapture={onKeyDownCapture}
				children={props.children}
			/>
		</div>
    );
};
