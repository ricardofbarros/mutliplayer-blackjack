import React, {Component} from 'react';
import {RouteHandler} from 'react-router';
import { connect } from 'react-redux';
import Header from '../components/common/header';
import Cookies from '../store/cookies';
import SessionActions from '../actions/session';
import UserActions from '../actions/user';

class App extends Component {
  propTypes = {
    getUserInfo: React.PropTypes.func.isRequired,
    hydrateUser: React.PropTypes.func.isRequired,
    hydrateSession: React.PropTypes.func.isRequired,
    user: React.PropTypes.object
  }

  async componentDidMount () {
    let accessToken = Cookies.get('accessToken');
    if (accessToken) {
      let result = await this.props.getUserInfo(accessToken);

      if (!result.payload) {
        return;
      }

      // User is currently playing a game
      if (result.payload.table) {
        // Do something
      } else {
        this.props.hydrateUser(result.payload.user);
        this.props.hydrateSession(result.payload.session);
      }
    }
  }

  render () {
    var user = this.props.user;

    return (
      <div>
        {(() => {
          if (user.id) {
            return <Header name={user.username} money={user.accountBalance}/>;
          }
        })()}
        <div className='container'>
          <RouteHandler/>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    user: state.user,
    tables: state.tables,
    session: state.session
  };
}

export default connect(
  mapStateToProps,
  {...SessionActions, ...UserActions}
)(App);
