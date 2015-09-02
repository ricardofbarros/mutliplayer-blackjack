import React, {Component} from 'react';
import './lobbyBox.css';

class LobbyBox extends Component {
  static propTypes = {
    box: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      createdDate: React.PropTypes.object,
      sittingPlayers: React.PropTypes.array,
      tableLimit: React.PropTypes.shape({
        players: React.PropTypes.number,
        money: React.PropTypes.number
      }),
      numberOfDecks: React.PropTypes.number
    })
  }

  render () {
    var table = this.props.box;

    return (
      <div id={table.id} className='col-md-3 col-md-push-1 lobby-box no-select'>
        <div className='lobby-box-title col-md-12'>{table.name}</div>
        <div className='col-md-2 col-md-push-1 lobby-box-info'>
          {table.numberOfDecks}
          <span className='icomoon icomoon-stack'></span>
        </div>
        <div className='col-md-3 col-md-push-2 lobby-box-info'>
          {table.sittingPlayers.length} / {table.tableLimit.players}&nbsp;
          <span className='glyphicon glyphicon-user' aria-hidden='true'></span>
        </div>
        <div className='col-md-5 col-md-push-2 lobby-box-info'>
          {table.tableLimit.money}&nbsp;
          <span className='glyphicon glyphicon-euro' aria-hidden='true'></span>
        </div>
      </div>
    );
  }
}

export default LobbyBox;
