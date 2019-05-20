import React, { Component } from 'react';
import axios from 'axios';
import Joke from './Joke';

const BASE_URL = 'https://icanhazdadjoke.com';

class Jokelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: []
    };

    this.getJokes = this.getJokes.bind(this);
    this.upvoteJoke = this.upvoteJoke.bind(this);
    this.downvoteJoke = this.downvoteJoke.bind(this);
  }

  async componentDidMount() {
    await this.getJokes();
  }

  async getJokes() {
    let random = Math.floor(Math.random() * 50 );
    const response = await axios.get(`${BASE_URL}/search?limit=10&page=${random}`, {headers: { Accept: "application/json"}});
    let jokes = response.data.results.map(jokeObj => ({ ...jokeObj, upvotes: 0, downvotes: 0 }));

    this.setState({ jokes });
  }

  upvoteJoke(id) {
    this.setState(st => {
      let targetJoke = st.jokes.filter(joke => joke.id === id)[0];
      targetJoke.upvotes += 1;
      return { jokes: st.jokes.map(joke => joke.id === id ? targetJoke : joke) };
    });
  }

  downvoteJoke(id) {
    this.setState(st => {
      let targetJoke = st.jokes.filter(joke => joke.id === id)[0];
      targetJoke.downvotes += 1;
      return { jokes: st.jokes.map(joke => joke.id === id ? targetJoke : joke) };
    });
  }

  render() {
    let jokes = this.state.jokes.map(joke => (
      <Joke
        key={joke.id}
        joke={joke.joke}
        upvotes={joke.upvotes}
        downvotes={joke.downvotes}
        upvoteJoke={() => this.upvoteJoke(joke.id)}
        downvoteJoke={() => this.downvoteJoke(joke.id)}
      />));
    return (
      <div>
        { jokes }
      </div>
    );
  }
}

export default Jokelist;
