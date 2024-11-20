import './editor.css';
import React, { ReactElement, useEffect, useState } from "react";
import { Section } from "../section/section";

/*
    An Editor is essentially a collection of Sections.
*/

interface EditorProps {
	id?: string,
	editorKey?: string
};

let sectionCounter = 0; // Counter outside the component to ensure uniqueness

export function Editor(props: EditorProps) {
    const [sections, setSections] = useState<ReactElement[]>([]);

	const createSection = (content?: any) => {
		const secKey = `${props.editorKey}-sec-${sectionCounter++}`;
		// Ensures the key is properly assigned for React while allowing you to pass the same secKey to the Section component as a prop (secKey).
		return React.cloneElement(<Section children={content} secKey={secKey} />, { key: secKey })
	};

	// Start with just one section:
	useEffect(() => {
		setSections([createSection()]);
	}, []);

	const onNewSection = (e: Event) => {
		const content = (e as CustomEvent).detail.contentEl;
		console.log('new section with content: ', content);
		e.stopPropagation();
		setSections([...sections, createSection(content)]);
	};

	const onRemoveSection = (e: Event) => {
		const ce = e as CustomEvent;
		console.log('Deleting section ', ce.detail.secKey);
		// Find the index of the section with key = secKey and remove it:
		const idx = sections.findIndex(sec => sec.key === ce.detail.secKey);
		sections.splice(idx-1, 1);
		setSections([...sections]);
	};

    useEffect(() => {
		// Listen for new section events (triggered by the Section component):
        document.addEventListener("newSection", onNewSection);
		document.addEventListener("removeSection", onRemoveSection);

		return () => {
			document.removeEventListener("newSection", onNewSection);

			// get the new section element:
			const el = document.getElementById(`section-${sections.length}`)?.getElementsByClassName("content")[0] as HTMLElement;
			console.log('el = ', el);
			if(!el) return;

			// Put the caret (text cursor) in the new section:
			let range = document.createRange();		// Create a range (a range is a like the selection but invisible)
			range.selectNodeContents(el);			// Select the entire contents of the element with the range
			range.collapse(false);					//	collapse the range to the end point. false means collapse to end rather than the start
			let selection = window.getSelection();	// get the selection object (allows you to change selection)
			console.log('selection = ', selection);
			selection?.removeAllRanges();			// remove any selections already made
			selection?.addRange(range);				// make the range you have just created the visible selection
        };

    }, [sections]);

    return (
        <div className="sections-container" id={props.id} key={props.editorKey}>
            { sections }
        </div>
    );
};