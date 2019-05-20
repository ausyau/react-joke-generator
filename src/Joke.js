import React, { Component } from 'react';

class Joke extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Joke: {this.props.joke} </p> 
        <button onClick={this.props.upvoteJoke}>Upvotes: {this.props.upvotes} </button> 
        <button onClick={this.props.downvoteJoke}>Downvotes: {this.props.downvotes}</button>
      </div>
    );
  }
}

export default Joke;