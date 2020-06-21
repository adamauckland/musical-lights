import React, { Component } from 'react';
import './App.css';
import { Player } from './Player';

export class App extends Component {
	constructor(props) {
		super(props);

		this.fn = [];
	}

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
					<tr>
						<td>
							<Player transpose={ -24 } start={ (fn) => this.attachStartHandler(fn) }></Player>
						</td>
						<td>
							<button className="shuttle-button" onClick={ () => this.go() }>Play</button>
						</td>
						<td>
							<Player transpose={ -12 } start={ (fn) => this.attachStartHandler(fn) }></Player>
						</td>
					</tr>
				</table>
			</div>
		);
	}
}

export default App;
