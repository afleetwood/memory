import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root) {
  ReactDOM.render(<Grid />, root);
}

function Tile(params) {
  var showing = params.flipped ? 'showing' : 'hidden';

  if(params.matched) {
    return (
        <button className="match-tile">{params.value}</button>
    );
  }
  else {
    if (params.flipped) {
      return (
          <button className={showing} onClick={params.handleClick.bind(this)}>{params.value}</button>      
      );
    }
    else {
      return (
          <button className={showing} onClick={params.handleClick.bind(this)}></button> 
      );
    }
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: this.initializeGrid(),
      guessTiles: [],
      matchTiles: [],
      score: 0,
    }
  }

  /* ----- GAME FUNCTIONS ----- */

  initializeGrid() {
    var grid = [
      {value: 'A', flipped: false, matched: false},
      {value: 'A', flipped: false, matched: false},
      {value: 'B', flipped: false, matched: false},
      {value: 'B', flipped: false, matched: false},
      {value: 'C', flipped: false, matched: false},
      {value: 'C', flipped: false, matched: false},
      {value: 'D', flipped: false, matched: false},
      {value: 'D', flipped: false, matched: false},
      {value: 'E', flipped: false, matched: false},
      {value: 'E', flipped: false, matched: false},
      {value: 'F', flipped: false, matched: false},
      {value: 'F', flipped: false, matched: false},
      {value: 'G', flipped: false, matched: false},
      {value: 'G', flipped: false, matched: false},
      {value: 'H', flipped: false, matched: false},
      {value: 'H', flipped: false, matched: false}
    ];

    var temp;
    var index;
    for (var i = 0; i < 16; i++) {
      index = Math.floor(Math.random() * 16);
      temp = grid[i];
      grid[i] = grid[index];
      grid[index] = temp;
    }

    return grid;
  }

  handleClick(i) {
    var tiles = this.state.tiles.slice();
    var score = this.state.score;

    if (this.gameWon(tiles)) {
      return;
    }

    if (!tiles[i].matched) {
      // increment the click score
      score = score + 1;
      // indicate tile's value is visible
      tiles[i].flipped = true;
      // add this tile to the current guess
      this.state.guessTiles.push({tile: tiles[i], index: i});

      // if two tiles are flipped, evaluate the guess
      if (this.state.guessTiles.length == 2) {
	// let the user see tiles for 1 sec before ievaluation
	window.setTimeout(this.evaluateGuess.bind(this), 1000);
      }

      // set the new state
      this.setState({
	tiles: tiles,
        guessTiles: this.state.guessTiles,
        matchTiles: this.state.matchTiles,
        score: score
      })
    } else {
      // maybe a message about clicking a matched tile
    }
  }

  /* - Called when this.state.guessTiles holds two objects
     - Determines whether the values of the two objects are equal
  */
  evaluateGuess() {
    const guessTiles = this.state.guessTiles.slice();
    const matchTiles = this.state.matchTiles.slice();

    // determine a match
    if (guessTiles[0].tile.value === guessTiles[1].tile.value) {
      // yes match
      // add tiles to correct match array, remove guesses
      for (var i = 0; i < 2; i++) {
        this.state.tiles[guessTiles[i].index].matched = true;
      }
      for (var i = 0; i < 2; i++) {
        matchTiles.push(guessTiles.shift());
      }
    }
    else {
      // no match
      // flip tiles to hidden state, remove guesses
      for (var i = 0; i < 2; i++) {
	this.state.tiles[guessTiles[i].index].flipped = false;
      }
      
    }

    this.setState({
      tiles: this.state.tiles,
      guessTiles: [],
      matchTiles: matchTiles,
      score: this.state.score
    });
    return;
  }
  
  gameWon() {
    return this.state.matchTiles.length == 16;
  }

  restartGame() {
    this.setState({
      tiles: this.initializeGrid(),
      guessTiles: [],
      matchTiles: [],
      score: 0,
    });
  }

  /* ----- RENDERING FUNCTIONS ----- */

  renderTile(i) {
    var tiles = this.state.tiles.slice();
    return <Tile value={tiles[i].value} flipped={tiles[i].flipped} matched={tiles[i].matched} handleClick={this.handleClick.bind(this, i)} />;
  }

  render() {
    const wonYet = this.gameWon(this.state.matchTiles);
    let status;
    if (wonYet) {
      status = 'You won! Your matching efficiency: ' + (16 / this.state.score * 100) + '%';
    } else {
      status = 'Number of clicks: ' + (this.state.score);
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="grid-row">
          {this.renderTile(0)}
          {this.renderTile(1)}
          {this.renderTile(2)}
          {this.renderTile(3)}
        </div>
        <div className="grid-row">
          {this.renderTile(4)}
          {this.renderTile(5)}
          {this.renderTile(6)}
          {this.renderTile(7)}
        </div>
        <div className="grid-row">
          {this.renderTile(8)}
          {this.renderTile(9)}
          {this.renderTile(10)}
          {this.renderTile(11)}
        </div>
        <div className="grid-row">
          {this.renderTile(12)}
          {this.renderTile(13)}
          {this.renderTile(14)}
          {this.renderTile(15)}
        </div>
        <br />
        <div>
	  <button 
            className="restartButton" 
            onClick={this.restartGame.bind(this)}>
              Restart game
          </button>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return(
      <div className="memory-game">
        <div className="memory-grid">
          <Grid />
        </div>
      </div>
    );
  }
}


