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
			<div className="App" style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>
				<div style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>
					<div className="panel-separator">
						<Player transpose={ -24 } start={ (fn) => this.attachStartHandler(fn) }></Player>
					</div>
					<div className="panel-center">
						<button className="shuttle-button" onClick={ () => this.go() }>Play Both</button>
					</div>
					<div className="panel-separator">
						<Player transpose={ -12 } start={ (fn) => this.attachStartHandler(fn) }></Player>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
