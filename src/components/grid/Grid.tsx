import './Grid.css';
import React, { useState, ReactElement, useEffect } from 'react';
import { Editor } from '../../editor/editor';

// Defines what a cell contains (a Section component)
const gridCell = (row: number, col: number) => {
	const cellKey = `cell${row},${col}`;
	return (
		<div className="grid-cell" key={cellKey}>
			{
				React.cloneElement(
					<Editor editorKey={`${cellKey}-edit`} />,
					{ key: cellKey }
				)
			}
		</div>
	)
};

//	A matrix of Editor's
export function Grid(props: {}) {

	const [matrix, setMatrix] = useState<ReactElement[][]>([]);

	// Start with 1 cell
	useEffect(() => {
		setMatrix( [ [gridCell(0,0)] ] );
	}, []);

	// Add a new row to the matrix
	const addRow = () => {
		// Use the # of columns in the last row as # of columns in the new row
		const numCols = matrix.at(-1)!.length;
		const rowNum = matrix.length;			// number of the new row
		const newRow = Array.from({ length: numCols }, (_, colNum) => gridCell(rowNum, colNum));
		// Add it
		setMatrix([...matrix, newRow]);
	};

	const addCol = () => {
		// Create a new column w' the same # rows:
		const numRows = matrix.length;
		const colNum = matrix.at(-1)!.length; 	// number of the new column
		const newCol = Array.from({ length: numRows }, (_, rowNum) => gridCell(rowNum, colNum));
		// Add it
		setMatrix(matrix.map((row, i) => [...row, newCol[i]]));
	}

	return (
		<div className="custom-grid">
			<div className="grid-content">
				{
					matrix.map((row, i) => (
						<div className="grid-row" key={`row-${i}`}>
							{ row.map((_, j) => gridCell(i, j)) }
						</div>
					))
				}
			</div>
			<div contentEditable={false} className="grid-controls add-col" onClick={addCol}>+</div>
			<div contentEditable={false} className="grid-controls add-row" onClick={addRow}>+</div>
		</div>
	)
}