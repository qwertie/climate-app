import * as ReactDOM from 'react-dom';
import * as React from 'react';

class App extends React.Component<{greeting: string}, {count:number}> {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  render() {
      return (
          <div>
              <h2>{this.props.greeting}</h2>
              <button onClick={() => this.setState({count: this.state.count+1})}>
                This button has been clicked {this.state.count} times.
              </button>
          </div>);
  }
}

ReactDOM.render(
  <App greeting="Hello, world!"/>,
  document.getElementById('app')
);

ReactDOM.render(<App message="Hello, world!"/>, 
                document.getElementById("app"));
