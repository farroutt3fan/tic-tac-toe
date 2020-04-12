import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  let winnerColor = "";
  if (props.winner && props.winner === props.value) {
    winnerColor = " winner-color";
  }
  return (
    <button
      className={`square ${
        props.value === "X" ? "x-color" : "o-color"
      }${winnerColor}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={this.props.winner}
      />
    );
  }

  render() {
    return (
      <div className="tic-tac-toe-board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          selectedSquareId: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      selectedStep: step,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          selectedSquareId: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      selectedStep: null,
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const sqId = step.selectedSquareId;
      const column = 1 + (sqId % 3);
      const row = Math.floor(1 + sqId / 3);
      let selected = "";
      if (this.state.selectedStep === move) {
        selected = " bold";
      }
      const desc = move
        ? `Go to move #${move} (Column: ${column}, Row: ${row})`
        : "Go to game start";
      return (
        <li key={move} className={selected}>
          <button
            className={`move-button${selected}`}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    let statusColor;
    if (winner) {
      status = `${winner} wins!`;
      statusColor = winner === "X" ? "x-color" : "o-color";
    } else if (!winner && history.length === 10) {
      status = "That was a draw :(";
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
      statusColor = this.state.xIsNext ? "x-color" : "o-color";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
          <p className={`status ${statusColor}`}>{status}</p>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
