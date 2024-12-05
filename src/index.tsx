import ReactDOM from 'react-dom/client';
import './index.css';
import { FreeDragContainer } from './FreeDragContainer/FreeDragContainer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Children } from 'react';
import { Editor } from './editor/editor';

function App() {

    return (
        <DndProvider backend={HTML5Backend}>
            <FreeDragContainer >
                <Editor id="editor-1" editorKey="editor-1"/>
                <Editor id="editor-2" editorKey="editor-2"/>
            </FreeDragContainer>
        </DndProvider>
    );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
