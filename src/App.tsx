import { ReactElement, useEffect, useState } from "react";
import "./App.css";

// -------- CUSTOM SECTION COMPONENTS --------

function Callout(props: { }) {
	return (
		<div className="callout">
			<div className="head"></div>
			<div className="content"></div>
		</div>
	)
};

function BulletList(props: {}) {

	return (
		<ul className="bullet-list">
			<li></li>
		</ul>
	)
}

// -------- MAIN COMPONENTS --------

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

function Section(props: {
	secNum: number,
	children?: ReactElement
}) {
    const onKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.shiftKey && e.key === "Enter") {
            e.preventDefault(); // prevents the default behavior of inserting a newline
            console.log("shift+enter => new section");
            // signal to the parent that a new section should be created:
            e.target.dispatchEvent(getNewSectionEvent());
        } else if (e.key === "Enter") {
            const text = e.currentTarget.textContent;
			if (! text) return;
            if (text.endsWith("###")) {
                e.preventDefault();  // prevents the default behavior of inserting a newline
                e.currentTarget.style.fontSize = "1.2em";
				// remove the last 3 characters
				e.currentTarget.textContent = text.slice(0, -3);
            } else if (text.endsWith("##")) {
				e.preventDefault();  // prevents the default behavior of inserting a newline
				e.currentTarget.style.fontSize = "1.5em";
				// remove the last 2 characters
				e.currentTarget.textContent = text.slice(0, -2);
			} else if (text.endsWith("#")) {
				e.preventDefault();  // prevents the default behavior of inserting a newline
				e.currentTarget.style.fontSize = "2em";
				// remove the last character
				e.currentTarget.textContent = text.slice(0, -1);
			}
			else if(text.endsWith("/call")) {
				e.target.dispatchEvent(getNewSectionEvent(<Callout/>));
				e.currentTarget.textContent = text.slice(0, -5);
			}
        } else if (e.key === " ") {
			console.log('space key pressed');
			const text = e.currentTarget.textContent;
			console.log('text = ', text);
			if (! text) return;
			if (text === "-") {
				e.target.dispatchEvent(getNewSectionEvent(<BulletList/>));
				e.currentTarget.textContent = text.slice(0, -1);
			}
		}
    };

	const removeSection = (e: React.MouseEvent<HTMLDivElement>) => {
		document.dispatchEvent(getRemoveSectionEvent(props.secNum));
	};

	const SectionControls = (props: {}) => {
		return (
			<div className="controls">
				<div className="remove-section" onClick={removeSection}>X</div>
			</div>
		)
	};

    return (
        <div className="section" id = {`section-${props.secNum}`}>
			<SectionControls />
			<div
				className="content"
				contentEditable
				onKeyDownCapture={onKeyDownCapture}
			>
				{ props.children }
			</div>
		</div>
    );
};

function Editor() {
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
			let range = document.createRange();		//C reate a range (a range is a like the selection but invisible)
			range.selectNodeContents(el);			// Select the entire contents of the element with the range
			range.collapse(false);					//	collapse the range to the end point. false means collapse to end rather than the start
			let selection = window.getSelection();	// get the selection object (allows you to change selection)
			console.log('selection = ', selection);
			selection?.removeAllRanges();			// remove any selections already made
			selection?.addRange(range);				//make the range you have just created the visible selection
        };
    }, [sections]);

    return (
        <div id="app">
            <h1>Editor</h1>
            <div id="sections-container">
				{ sections }
			</div>
        </div>
    );
};

function App() {
    return <Editor />;
};

export default App;
