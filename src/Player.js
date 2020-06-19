import React, { Component } from "react";
import Tone from "react-tone";
import { PianoRoll } from "./data/PianoRoll";
import { NoteSlice } from "./NoteSlice";

export class Player extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isTonePlaying: false,
			pianoRoll: new PianoRoll(),
			beatStep: 0,
			stopping: false
		};

		this.audioContext = undefined;
		this.iosAudioContextUnlocked = false;
	}

	componentDidMount() {
		this.audioContext = new AudioContext();
	}

	handleClick = () => {
		if (!this.iosAudioContextUnlocked) this.playEmptyBuffer();

		this.setState({ isTonePlaying: true });
	}

	playEmptyBuffer = () => {
		// start an empty buffer with an instance of AudioContext
		const buffer = this.audioContext.createBuffer(1, 1, 22050);
		const node = this.audioContext.createBufferSource();
		node.buffer = buffer;
		node.start(0);
		this.iosAudioContextUnlocked = true;
	}

	handleToneStop = () => {
		let nextBeatStep = this.state.beatStep + 1;

		// loop
		if (nextBeatStep >= this.state.pianoRoll.grid.length) {
			nextBeatStep = 0;
		}

		this.setState({
			...this.state,
			isTonePlaying: false,
			beatStep: nextBeatStep
		}, () => {
			if (this.state.stopping === false) {
				this.setState({
					...this.state,
					isTonePlaying: true
				});
			} else {
				this.setState({
					...this.state,
					stopping: false,
					beatStep: 0 // return to the start
				});
			}
		});
	}

	toggleNote(notes, note) {
		const newEnabled = !note.enabled;

		// mute all notes
		notes.forEach(disableNote => disableNote.enabled = false);

		// toggle the selected note
		note.enabled = newEnabled;

		this.setState({
			pianoRoll: this.state.pianoRoll
		});
	}

	stop() {
		this.setState({
			...this.state,
			stopping: true
		});
	}

	getCurrentFrequency() {
		let currentStep = this.state.pianoRoll.grid[this.state.beatStep];

		if (currentStep === undefined) {
			// no step, ignore.
			return 0;
		}

		let currentNoteSearch = currentStep.filter(note => note.enabled === true);

		if (currentNoteSearch.length > 0) {
			let currentNote = currentNoteSearch[0];

			console.log(currentNote.frequency);

			return currentNote.frequency;
		}

		// no notes triggered to play
		return 0;
	}

	render() {
		// Pass the same instance of AudioContext that played an empty buffer to <Tone />
		return (
			<div>
				<div className="shuttle">
					{ this.state.isTonePlaying ? <button className="shuttle-button" onClick={ () => this.stop() }>Stop</button> : <button className="shuttle-button" onClick={ this.handleClick}>Play</button> }
				</div>

				{ this.state.beatStep }

				{ this.state.pianoRoll.grid.map((notes, index) => <NoteSlice key={ index } isPlaying={ this.state.isTonePlaying && index === this.state.beatStep } notes={ notes } clickDelegate={ (note) => this.toggleNote(notes, note) }></NoteSlice>) }

				<Tone
					audioContext={ this.audioContext }
					play={ this.state.isTonePlaying }
					frequency={ this.getCurrentFrequency() }
					volume={ 1 }
					length={ 0.5 }
					onStop={ this.handleToneStop }
				/>
			</div>
		);
	}
}