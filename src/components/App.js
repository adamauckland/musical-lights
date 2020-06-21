import React, { Component } from 'react';
import { Player } from './Player';
import './App.css';

export class App extends Component {
	constructor(props) {
		super(props);

		this.fn = [];
	}

	// handler to trigger both components simultaneously
	go() {
		this.fn.forEach(fn => fn());
	}

	attachStartHandler(fn) {
		this.fn.push(fn);
	}

	render() {
		return (
			<div className="App">
				<table style={{ width: "100%"}}>
					<tbody>
						<tr>
							<td>
								<Player transpose={ -24 } start={ (fn) => this.attachStartHandler(fn) }></Player>
							</td>
							<td>
								<button className="shuttle-button" onClick={ () => this.go() }>Play Both</button>
							</td>
							<td>
								<Player transpose={ -12 } start={ (fn) => this.attachStartHandler(fn) }></Player>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default App;
