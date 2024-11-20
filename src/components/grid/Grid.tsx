import './Grid.css';
import { useState, ReactElement, useEffect } from 'react';
import { Editor } from '../../editor/editor';

/*
	A matrix of Editor's
*/
export function Grid(props: {}) {

	// Store a matrix of components that can grow as state:
	const [matrix, setMatrix] = useState<ReactElement[][]>([]);

	// Defines what a cell contains (a Section component)
	const getNewCell = () => {
		const matrixSize = matrix.map(row => row.length).reduce((a, b) => Math.max(a, b), 0);
		return <Editor />
	}

	// Start with just one row and one column:
	useEffect(() => {
		setMatrix([[getNewCell()]]);
	}, []);

	const addRow = () => {
		// Add a new row to the matrix:
		const numCols = matrix[0].length;

		// Create a new row with the same number of columns:
		const newRow = Array(numCols).fill(getNewCell());

		// Add it
		const newMatrix = [...matrix, newRow];
		setMatrix(newMatrix);
	};

	const addCol = () => {
		// Add a new column to the matrix:
		const numRows = matrix.length;

		// Create a new column with the same number of rows:
		const newCol = Array(numRows).fill(getNewCell());

		// Add it
		const newMatrix = matrix.map((row, i) => [...row, newCol[i]]);
		setMatrix(newMatrix);
	}

	return (
		<div className="custom-grid">
			<div className="grid-content">
				{matrix.map((row, i) => (
					<div className="grid-row" key={i}>
						{row.map((cell, j) => (
							<div className="grid-cell" key={j}>
								{cell}
							</div>
						))}
					</div>
				))}
			</div>
			<div contentEditable={false} className="grid-controls add-col" onClick={addCol}>+</div>
			<div contentEditable={false} className="grid-controls add-row" onClick={addRow}>+</div>
		</div>
	)
}