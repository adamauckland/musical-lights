import React, { Component } from "react";

const noop = () => {};

export class NoteButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			note: null,
			clickDelegate: noop
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			note: nextProps.note,
			clickDelegate: nextProps.clickDelegate
		};
	}

	render() {
		// Not defined yet. Don't render.
		if (this.state.note === null) {
			return;
		}

		let classes = "note-button enabled-" + this.state.note.enabled.toString();

		return (
			<React.Fragment>
				<button className={ classes } onClick={ () => this.state.clickDelegate(this.state.note) }>{ this.state.note.enabled ? "On" : "Off" }</button>
				<br />
			</React.Fragment>
		);
	}
}