import React, { Component } from 'react';
import { RouteHandler, Navigation } from 'react-router';
import { connect } from 'react-redux';
import Header from '../components/common/header';
import Cookies from '../store/cookies';
import SessionActions from '../actions/session';
import reactMixin from 'react-mixin';
import Spinner from '../components/common/spinner';
import toastr from 'toastr';

@reactMixin.decorate(Navigation)
class App extends Component {
  static propTypes = {
    getUserInfo: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    session: React.PropTypes.object
  }

  constructor () {
    super();

    this.state = {
      accessToken: Cookies.get('accessToken')
    };
  }

  async componentDidMount () {
    if (this.state.accessToken) {
      let result = await this.props.getUserInfo(this.state.accessToken);

      // User is currently playing a game
      if (result.payload.table) {
        this.transitionTo('game');
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    let self = this;

    // Unauthorized or logged out
    if (nextProps.sessionExpired) {
      Cookies.expire('accessToken');
      self.state.accessToken = null;
      setTimeout(function () {
        self.transitionTo('login');
      }, 500);
    }

    // Just logged in
    if (!self.state.accessToken && nextProps.session && nextProps.session.id) {
      self.state.accessToken = nextProps.session.accessToken;
      self.transitionTo('app');
    }
  }

  async logout (e) {
    e.preventDefault();

    if (!this.state.accessToken) {
      return toastr.warning('Please refresh your page, then try again...');
    }

    let result = await this.props.logout(this.state.accessToken);

    // Clean up
    if (!result.error) {
      this.state = { accessToken: null };
      Cookies.expire('accessToken');
      this.transitionTo('login');
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
            return (
              <Header
                name={session.username}
                money={session.accountBalance}
                onClick={this.logout.bind(this)}
              />
            );
          }
        })()}
        <RouteHandler/>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    session: state.session,
    sessionExpired: state.sessionExpired
  };
}

export default connect(
  mapStateToProps,
  {...SessionActions}
)(App);
