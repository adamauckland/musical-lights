import React, { Component } from "react";
import Tone from "react-tone";
import { PianoRoll } from "../data/PianoRoll";
import { NoteSlice } from "./NoteSlice";

export class Player extends Component {
	constructor(props) {
		super(props);

		let tracks = localStorage["tracks"];

		if (!tracks) {
			tracks = [];
		}

		this.state = {
			isTonePlaying: false,
			isThisPlaying: false,
			pianoRoll: new PianoRoll(),
			beatStep: 0,
			stopping: false,
			storedLoops: tracks
		};

		this.audioContext = undefined;
		this.iosAudioContextUnlocked = false;
		this.intervalHandler = null;
		this.startTime = 0;
	}

	componentDidMount() {
		this.audioContext = new AudioContext();
	}

	handleClick() {
		if (!this.iosAudioContextUnlocked) {
			this.playEmptyBuffer();
		}

		this.setState({
			isTonePlaying: true
		});
	}

	playEmptyBuffer() {
		// start an empty buffer with an instance of AudioContext
		const buffer = this.audioContext.createBuffer(1, 1, 22050);
		const node = this.audioContext.createBufferSource();

		node.buffer = buffer;
		node.start(0);

		this.iosAudioContextUnlocked = true;
	}

	handleToneStop() {
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
		// if we're playing, disconnect the oscillator
		if (this.state.isThisPlaying === true) {
			this.oscillator.disconnect(this.gainNode);

			if (this.intervalHandler) {
				window.clearInterval(this.intervalHandler);
			}
		}

		this.setState({
			...this.state,
			isThisPlaying: false,
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

			return currentNote.frequency;
		}

		// no notes triggered to play
		return 0;
	}

	go() {
		// don't double play
		if (this.state.isThisPlaying === true) {
			return;
		}

		this.setState({
			isThisPlaying: true,
			beatStep: 0
		}, () => {
			this.setupOscillator();

			this.setupBeatTimer();
		});
	}

	setupOscillator() {
		this.gainNode = this.audioContext.createGain();
		this.oscillator = this.audioContext.createOscillator();
		this.oscillator.type = "triangle";
		this.oscillator.frequency.value = this.getCurrentFrequency();

		this.gainNode.gain.value = 1;
		this.gainNode.connect(this.audioContext.destination);
		this.startTime = this.audioContext.currentTime;

		this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
		this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);

		this.oscillator.start(0);

		this.oscillator.connect(this.gainNode);
	}

	setupBeatTimer() {
		this.intervalHandler = window.setInterval(() => {
			let nextBeatStep = this.state.beatStep + 1;

			// loop
			if (nextBeatStep >= this.state.pianoRoll.grid.length) {
				nextBeatStep = 0;
			}

			this.setState({
				...this.state,
				beatStep: nextBeatStep
			}, () => {
				this.adjustFrequency();
			});
		}, 250);
	}

	adjustFrequency() {
		this.oscillator.frequency.value = this.getCurrentFrequency();
		if (this.oscillator.frequency.value === 0) {
			this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
		} else {
			this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
			// we need to set to zero to avoid clicks
			this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
			this.gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.01);
			this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1 + (Math.random() * 0.2));
		}
	}

	nudgeRight() {
		const roll = this.state.pianoRoll;
		const top = roll.grid.pop();

		roll.grid.unshift(top);

		this.setState({
			pianoRoll: roll
		});
	}

	nudgeLeft() {
		const roll = this.state.pianoRoll;
		const bottom = roll.grid.shift();

		roll.grid.push(bottom);

		this.setState({
			pianoRoll: roll
		});
	}

	render() {
		// Pass the same instance of AudioContext that played an empty buffer to <Tone />
		return (
			<div>
				<div className="shuttle">
					{ this.state.isTonePlaying ?
						<button className="shuttle-button" onClick={ () => this.stop() }>Stop</button>
						:
						<button className="shuttle-button" onClick={ () => this.handleClick() }>Play RT</button>
					}

					{ this.state.isThisPlaying ?
						<button className="shuttle-button" onClick={ () => this.stop() }>Stop</button>
						:
						<button className="shuttle-button" onClick={ () => this.go() }>Play</button>
					}
				</div>

				<div className="note-wrapper">
					<div className="note-container">
						{ this.state.pianoRoll.grid.map((notes, index) => <NoteSlice key={ index } isPlaying={ (this.state.isTonePlaying || this.state.isThisPlaying) && index === this.state.beatStep } notes={ notes } clickDelegate={ (note) => this.toggleNote(notes, note) }></NoteSlice>) }
					</div>
				</div>

				<div className="button-wrapper">
					<button className="button-nudge" onClick={ () => this.nudgeLeft() }>⇠</button>
					<button className="button-nudge" onClick={ () => this.nudgeRight() }>⇢</button>
				</div>

				<Tone
					audioContext={ this.audioContext }
					play={ this.state.isTonePlaying }
					frequency={ this.getCurrentFrequency() }
					volume={ 1 }
					length={ 0.5 }
					onStop={ () => this.handleToneStop() }
				/>
			</div>
		);
	}
}