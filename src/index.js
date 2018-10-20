import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }
// Replace Square class to function component
function Square(props) {
  let className = "square";
  if (props.highlight) {
    className += " highlighted";
  }
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  // Array of possible winning states
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // if all states are the same (same symbol)
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i]
      };
    }
  }

  if (squares.every(value => value)) {
    return {
      winner: "draw",
      line: null
    };
  }
  return {
    winner: null,
    line: null
  };
}

class Board extends React.Component {
  renderSquare(i, highlight) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={highlight}
      />
    );
  }

  render() {
    let squares = [];
    var rows = [];
    for (var i = 0; i < 3; i++) {
      for (var j = i * 3; j < i * 3 + 3; j++) {
        const highlight =
          this.props.winnerLine && this.props.winnerLine.includes(j);
        squares.push(this.renderSquare(j, highlight));
      }
      rows.push(
        <div key={i} className="board-row">
          {squares}
        </div>
      );
      squares = [];
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          clicked: null
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      sortAsc: true
    };
  }

  resetGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          clicked: null
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      sortAsc: true
    });
  }

  toggleAsc() {
    this.setState({
      sortAsc: !this.state.sortAsc
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const currentRow = parseInt(i / 3 + 1);
    var currentCol = i + 1;
    while (currentCol > 3) {
      currentCol -= 3;
    }

    // Creates a copy of the array for immutability
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          clicked: [currentRow, currentCol]
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " " +
          (move % 2 === 0 ? "O" : "X") +
          "(" +
          history[move].clicked +
          ")"
        : "Go to game start";
      return (
        // bold for current/selected item
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner.winner && winner.winner !== "draw") {
      status = "Winner: " + winner.winner;
    } else if (winner.winner === "draw") {
      status = "The game is a DRAW ";
      window.alert("This game is a DRAW");
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winnerLine={winner.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.toggleAsc()}>
              {this.state.sortAsc ? "Sort descending" : "Sort ascending"}
            </button>
            <button onClick={() => this.resetGame()}>Reset game</button>
          </div>
          {this.state.sortAsc ? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
