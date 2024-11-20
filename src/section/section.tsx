import './section.css';
import { createRef, ReactElement, useEffect, useState } from "react";
import * as CC from "../components/index";

// -------- CUSTOM SECTION COMPONENTS --------

const CUSTOM_COMPONENTS: { [key: string]: (props: {}) => ReactElement } = {
	"call": CC.Callout,
	"grid": CC.Grid,
	"list": CC.BulletList
};

// -------- SECTION CONTROLS --------

function SectionControls(props: {
	onRemoveSection: (secKey: string) => void,	// Function to remove the section
	secRef: React.RefObject<HTMLDivElement>,	// Reference to the section element being controlled
	secKey: string								// Unique key of the referenced section
}) {

	const removeSection = (e: React.MouseEvent<HTMLDivElement>) => {
		props.onRemoveSection(props.secKey);
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

export interface SectionProps {
	secKey: string,
	onNewSection: (secKey: string, content?: ReactElement) => void,
	onRemoveSection: (secKey: string) => void,
	children?: ReactElement,
	enableControls?: boolean,
};

export function Section(props: SectionProps) {

	// Section controls are ENABLED by DEFAULT
	const enableControls = props.enableControls ?? true;

	// For the parent to be able to reference this section
	const secRef = createRef<HTMLDivElement>();

	const onKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// TODO: this should be implemented as a DFA machine to handle the different states

		const TXT = e.currentTarget.textContent;

		// SHIFT+ENTER ==> NEW SECTION
		if (e.shiftKey && e.key === "Enter") {
			e.preventDefault(); // prevents the default behavior of inserting a newline
			// signal to the parent that a new section should be created:
			props.onNewSection(props.secKey, undefined);
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
					props.onNewSection(props.secKey, <CustomComponent/>);
					e.currentTarget.textContent = TXT.slice(0, -commandMatch[0].length);
					return;
				}
			}
		}
		// ####################### BULLET LIST #######################
		else if (e.key === " ") {
			if (TXT === "-") {
				props.onNewSection(props.secKey, <CC.BulletList/>);
				e.currentTarget.textContent = TXT.slice(0, -1);
			}
			return;
		}
		// ####################### NO COMMAND #######################
	};

    return (
        <div ref={secRef} className="section">

			{ enableControls ? <SectionControls onRemoveSection={props.onRemoveSection} secRef={secRef} secKey={props.secKey}/> : null }

			<div className="content"
				contentEditable={true}
				onKeyDownCapture={onKeyDownCapture}
				children={props.children}
			/>
		</div>
    );
};
