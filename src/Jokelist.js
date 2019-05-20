import React, { Component } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

const BASE_URL = 'https://icanhazdadjoke.com';

class Jokelist extends Component {
	constructor(props) {
		super(props);
		let previousPage;
		this.state = {
			isLoading: true,
			jokes: JSON.parse(window.localStorage.getItem('jokes')) || []
		};

		this.getJokes = this.getJokes.bind(this);
		this.upvoteJoke = this.upvoteJoke.bind(this);
		this.downvoteJoke = this.downvoteJoke.bind(this);
	}

	async componentDidMount() {
		await this.getJokes();
		this.setState((st) => ({ isLoading: false }));
	}

	async getJokes() {
    console.log("GETTING HERE");
		let jokes = this.state.jokes;
		let existingJokeIds = jokes.map((joke) => joke.id);
		let random = Math.floor(Math.random() * 50);
		const response = await axios.get(`${BASE_URL}/search?limit=10&page=${random}`, {
			headers: { Accept: 'application/json' }
		});

		// filter for duplcate jokes, add upovotes and downvotes to new jokes
		let newJokes = response.data.results
			.filter((joke) => !existingJokeIds.includes(joke.id))
			.map((jokeObj) => ({ ...jokeObj, upvotes: 0, downvotes: 0 }));

		// add new jokes to the jokes array
		jokes = jokes.concat(newJokes);

		let serialized = JSON.stringify(jokes);
		window.localStorage.setItem('jokes', serialized);

		this.setState({ jokes });
	}

	upvoteJoke(id) {
		this.setState((st) => {
			let targetJoke = st.jokes.filter((joke) => joke.id === id)[0];
			targetJoke.upvotes += 1;
			return { jokes: st.jokes.map((joke) => (joke.id === id ? targetJoke : joke)) };
		});
	}

	downvoteJoke(id) {
		this.setState((st) => {
			let targetJoke = st.jokes.filter((joke) => joke.id === id)[0];
			targetJoke.downvotes += 1;
			return { jokes: st.jokes.map((joke) => (joke.id === id ? targetJoke : joke)) };
		});
  }
  

	render() {
		let loading;
		let page = this.state.isLoading ? (
			<i className="fas fa-4x fa-spinner fa-spin" />
		) : (
			this.state.jokes
				.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
				.map((joke) => (
					<Joke
						key={joke.id}
						joke={joke.joke}
						upvotes={joke.upvotes}
						downvotes={joke.downvotes}
						upvoteJoke={() => this.upvoteJoke(joke.id)}
						downvoteJoke={() => this.downvoteJoke(joke.id)}
					/>
				))
		);
		return (
			<div>
				<button onClick={this.getJokes}>Get New Jokes</button>
				{page}
			</div>
		);
	}
}

export default Jokelist;
