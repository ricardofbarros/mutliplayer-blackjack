import React, { Component } from 'react';
import { Navigation } from 'react-router';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import { config } from '../store/cookies';
import LobbyList from '../components/lobbyList/lobbyList';
import Socket from 'socket.io-client';
import url from 'url';
import SessionActions from '../actions/session';
import TablesAction from '../actions/tables';
import toastr from 'toastr';
import { tables as tableValidation } from '../../common/validation';

@reactMixin.decorate(Navigation)
class LobbyPage extends Component {
  componentDidMount () {
    let self = this;
    if (!self.props.session.id) {
      self.transitionTo('login');
      return;
    }

    let accessToken = self.props.session.accessToken;
    self.props.hydrateTables(accessToken);

    if (!self.props.socket) {
      let socket = Socket(url.resolve(config.baseUrl, '/lobby'));

      socket.on('connect', () => {
        socket.emit('auth', { accessToken: self.props.session.accessToken });
      });

      socket.on('addTable', (data) => {
        self.props.addTable(data);
      });

      socket.on('removeTable', (data) => {
        self.props.removeTable(data);
      });

      socket.on('updateTable', (data) => {
        self.props.updateTable(data);
      });

      self.props.socket = socket;
    }
  }

  componentWillUnmount () {
    if (this.props.socket && typeof this.props.socket.disconnect === 'function') {
      this.props.socket.disconnect();
    }
  }

  async createNewTable (table, e) {
    e.preventDefault();

    // Run common validation
    let isNotValid = tableValidation(config.apiMsgState, table);
    if (isNotValid) {
      return toastr.error(isNotValid);
    }

    let result = await this.props.createNewTable(table);

    if (result.error) {
      toastr.error(result.data.message);
    } else {
      toastr.success(result.data.message);
    }
  }

  render () {
    let tables = this.props.tables;

    return (
      <div className='container'>
        <div className='col-md-push-9 col-md-3'>
          <button type='button' className='btn btn-success btn-lg' onClick={this.createNewTable}>
            <span className='glyphicon glyphicon-plus' aria-hidden='true'></span> New Table
          </button>
        </div>
        <LobbyList tables={tables}/>
      </div>
    );
  }
}

LobbyPage.propTypes = {
  session: React.PropTypes.object,
  tables: React.PropTypes.object,
  socket: React.PropTypes.any,
  hydrateTables: React.PropTypes.func,
  createNewTable: React.PropTypes.func
};

function mapStateToProps (state) {
  return {
    session: state.session,
    tables: state.tables
  };
}

export default connect(
  mapStateToProps,
  {...SessionActions, ...TablesAction}
)(LobbyPage);
