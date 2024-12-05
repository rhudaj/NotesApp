import './editor.css';
import React, { ReactElement, useEffect, useState } from "react";
import { Section, SectionProps } from "../section/section";

interface EditorProps {
	id?: string,
	editorKey?: string
};

let sectionCounter = 0; // Counter outside the component to ensure uniqueness

// An Editor is essentially a collection of Sections.
export function Editor(props: EditorProps) {

	const [sections, setSections] = useState<SectionProps[]>([]);

	const createSectionProps = (content?: any) => ({
		children: content,
		secKey: `${props.editorKey}-sec-${sectionCounter++}`,
		onNewSection: handleNewSection,
		onRemoveSection: handleRemoveSection
	});

	// Start with just one section:
	useEffect(() => {
		console.log(`New Editor, key: ${props.editorKey}`);
		setSections([createSectionProps()]);
	}, []);

    const handleNewSection = (secKey: string, replace: boolean, content?: ReactElement) => {

		console.log(`handleNewSection:
			editor-key: ${props.editorKey},
			secKey: ${secKey},
			content ${content ? "provided" : "not provided"}:
		`);

		// Find the index by its UNIQUE key:
		const idx = sections.findIndex(sec => sec.secKey === secKey);

			if (idx === -1) {
				throw new Error(`Section with key ${secKey} not found`);
			}

		if (replace) {
			// Replace the section at idx with a new sectionProps:
			sections.splice(idx, 1, createSectionProps(content));
			setSections([...sections]); // new array reference
		} else {
			// Insert a new sectionProps directly after idx in the sections array:
			sections.splice(idx + 1, 0, createSectionProps(content));
			setSections([...sections]); // new array reference
		}
    };

	const handleRemoveSection = (secKey: string) => {
		// Find the index of the section with key = secKey and remove it:
		const idx = sections.findIndex(sec => sec.secKey === secKey);
		sections.splice(idx-1, 1);
		setSections([...sections]); // new array reference
	};

    return (
        <div className="sections-container" id={props.id} key={props.editorKey}>
            {
				sections.map(secProps => (
					React.cloneElement(
						<Section {...secProps}/>,
						{ key: secProps.secKey }
					)
				))
			}
        </div>
    );
};