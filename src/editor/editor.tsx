import './editor.css';
import { ReactElement, useEffect, useState } from "react";
import { Section } from "../section/section";

/*
    An Editor is essentially a collection of Sections.
*/

export function Editor() {
    const [sections, setSections] = useState<ReactElement[]>([<Section secNum={0}/>]);

	const onNewSection = (e: Event) => {
		const content = (e as CustomEvent).detail.contentEl;
		console.log('new section with content: ', content);
		e.stopPropagation();
		const new_section = (
			<Section secNum={sections.length}>
				{ content }
			</Section>
		);
		setSections([...sections, new_section]);
	};

	const onRemoveSection = (e: Event) => {
		const ce = e as CustomEvent;
		console.log('Deleting section ', ce.detail.secNum);
		sections.splice(ce.detail.secNum-1, 1);
		setSections([...sections]);
	};

	// Create a new section when the custom event is triggered:
    useEffect(() => {
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
        <div id="sections-container">
            { sections }
        </div>
    );
};