import ReactDOM from 'react-dom/client';
import './index.css';
import { Editor } from "./editor/editor";

function App() {
    return (
        <div id="app">
            <Editor id="root-editor" editorKey="root-editor"/>
        </div>
    );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
