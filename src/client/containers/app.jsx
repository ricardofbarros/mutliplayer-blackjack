import React, { Component } from 'react';
import { RouteHandler, Navigation } from 'react-router';
import { connect } from 'react-redux';
import Header from '../components/common/header';
import Cookies from '../store/cookies';
import SessionActions from '../actions/session';
import reactMixin from 'react-mixin';
import Spinner from '../components/common/spinner';

@reactMixin.decorate(Navigation)
class App extends Component {
  constructor () {
    super();

    this.state = {
      accessToken: Cookies.get('accessToken')
    };
  }

  async componentDidMount () {
    let self = this;
    if (this.state.accessToken) {
      let result = await this.props.getUserInfo(this.state.accessToken);

      // Unauthorized
      if (result.error) {
        Cookies.expire('accessToken');
        setTimeout(function () {
          self.transitionTo('login');
        }, 500);
      }

      // User is currently playing a game
      if (result.payload.table) {
        this.transitionTo('game');
      }
    }
  }

  render () {
    let session = this.props.session;

    // User is logged in but the data isn't
    // ready yet, return a loader/spinner
    if (this.state.accessToken && !session.id) {
      let spinCfg = {
        width: 12,
        radius: 35
      };

      return (
        <div>
          <Spinner config={spinCfg} />
        </div>
      );
    }

    return (
      <div>
        {(() => {
          if (session.id) {
            return <Header name={session.username} money={session.accountBalance}/>;
          }
        })()}
        <RouteHandler/>
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
