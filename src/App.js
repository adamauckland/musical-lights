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
				<Player></Player>
			</div>
		);
	}
}

export default App;
