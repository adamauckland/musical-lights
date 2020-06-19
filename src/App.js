import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Player } from './Player';

export class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showPlayer: false
		};
	}

	showPlayer() {
		this.setState({
			showPlayer: !this.state.showPlayer
		});
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
