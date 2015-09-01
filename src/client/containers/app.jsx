import React, {Component} from 'react';
import {RouteHandler} from 'react-router';
import { connect } from 'react-redux';
import Header from '../components/common/header';
import Cookies from '../store/cookies';
import SessionActions from '../actions/session';

class App extends Component {
  async componentDidMount () {
    let accessToken = Cookies.get('accessToken');
    if (accessToken) {
      let result = await this.props.getUserInfo(accessToken);

      // User is currently playing a game
      if (result.payload.table) {
        // Do something
      }
    }
  }

  render () {
    var session = this.props.session;

    return (
      <div>
        {(() => {
          if (session.id) {
            return <Header name={session.username} money={session.accountBalance}/>;
          }
        })()}
        <div className='container'>
          <RouteHandler/>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  getUserInfo: React.PropTypes.func.isRequired,
  session: React.PropTypes.object
};

function mapStateToProps (state) {
  return {
    session: state.session
  };
}

export default connect(
  mapStateToProps,
  {...SessionActions}
)(App);
