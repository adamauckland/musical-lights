import React, { Component } from 'react';
import './App.css';
import { Player } from './Player';

export class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="App">
				<table style={{ width: "100%"}}>
					<tr>
						<td>
							<Player></Player>
						</td>
						<td>
							<Player></Player>
						</td>
					</tr>
				</table>
			</div>
		);
	}
}

export default App;
