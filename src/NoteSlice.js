import React, { Component } from "react";
import { NoteButton } from "./NoteButton";
import { noop } from "./noop";

export class NoteSlice extends Component {
	constructor(props) {
		super(props);

		this.state = {
			notes: [],
			clickDelegate: noop,
			isPlaying: false
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			notes: nextProps.notes,
			clickDelegate: nextProps.clickDelegate,
			isPlaying: nextProps.isPlaying
		};
	}

	render() {
		const classes = "note-column playing-" + this.state.isPlaying.toString();

		return (
			<div className={ classes }>
				{ this.state.notes.map((note, index) => <NoteButton key={ index } note={ note } clickDelegate={ () => this.state.clickDelegate(note) }></NoteButton>)}
			</div>
		);
	}
}