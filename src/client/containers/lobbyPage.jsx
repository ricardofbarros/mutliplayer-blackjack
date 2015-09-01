import React, { Component } from 'react';
import { Navigation } from 'react-router';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';

@reactMixin.decorate(Navigation)
class LobbyPage extends Component {

  componentWillReceiveProps (nextProps) {
    if (!nextProps.session.id) {
      this.transitionTo('login');
    }
  }

  render () {
    return (
      <div>
      Hey!!!
      </div>
    );
  }
}

LobbyPage.propTypes = {
  session: React.PropTypes.object
};

function mapStateToProps (state) {
  return {
    session: state.session,
    tables: state.tables
  };
}

export default connect(mapStateToProps)(LobbyPage);
