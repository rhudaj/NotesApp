import './editor.css';
import { useEffect } from "react";
import { Section } from "../section/section";
import { useImmer } from "use-immer";
import { CUSTOM_COMPONENTS } from '../components';


interface SectionType {
	key: string,
	cname?: string
};

let sectionCounter = 0; // Counter outside the component to ensure uniqueness

// An Editor is essentially a collection of Sections.
export function Editor(props: {
	id?: string,
	editorKey?: string
}) {

	const [sections, setSections] = useImmer<SectionType[]>([]);

	// Start with just one section:
	useEffect(() => {
		console.log(`New Editor, key: ${props.editorKey}`);
		setSections([ createSection() ]);
	}, []);

	useEffect(() => {
		console.log(`Editor ${props.editorKey} NEW SECTIONS:`, sections);
	}, [sections]);

	const createSection = (cname?: string) => ({
		key: `${props.editorKey}-sec-${sectionCounter++}`,
		cname: cname
	});

    const handleNewSection = (secKey: string, replace: boolean, cname?: string) => {

		console.log(`handleNewSection:
			editor-key: ${props.editorKey},
			secKey: ${secKey},
			component-name ${cname ? "provided" : "not provided"}`);

		// Find the index by its UNIQUE key:
		const idx = sections.findIndex(sec => sec.key === secKey);

		if (idx === -1) {
			throw new Error(`Section with key ${secKey} not found in editor ${props.editorKey}`);
		}

		if (replace) {
			// Replace the section at idx with a new sectionProps:
			setSections(draft => {
				draft.splice(idx, 1, createSection(cname) );
			});
		} else {
			// Insert a new sectionProps directly after idx in the sections array:
			setSections(draft => {
				draft.splice(idx + 1, 0, createSection(cname));
			});
		}
    };

	const handleRemoveSection = (secKey: string) => {
		// Find the index of the section with key = secKey and remove it:
		const idx = sections.findIndex(sec => sec.key === secKey);
		if (idx === -1) {
			throw new Error(`Section with key ${secKey} not found`);
		}
		setSections(draft => {
			draft.splice(idx, 1);
		});
	};

    return (
        <div
			key={props.editorKey}
			className="sections-container"
			id={props.id}
		>
            {
				sections.map((sec: SectionType) => {
					const CustomComponent = sec.cname ? CUSTOM_COMPONENTS[sec.cname] : () => null
					return (
						<Section
							secKey={sec.key}
							enableControls={true}
							onNewSection={handleNewSection}
							onRemoveSection={handleRemoveSection}
						>
							<CustomComponent/>
						</Section>
					)
				})
			}
        </div>
    );
};