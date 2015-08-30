import React, {Component} from 'react';
import {RouteHandler} from 'react-router';
import Header from './components/common/header';

class App extends Component {

  render () {
    return (
      <div>
        {(() => {
          if (true) {
            return <Header name='Ricardo' money={1000}/>;
          }
        })()}
        <RouteHandler/>
      </div>
    );
  }

}

export default App;
