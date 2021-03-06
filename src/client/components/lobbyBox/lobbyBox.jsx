import React, {Component} from 'react';
import './lobbyBox.css';

class LobbyBox extends Component {
  static propTypes = {
    key: React.PropTypes.string,
    box: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      createdDate: React.PropTypes.string,
      sittingPlayers: React.PropTypes.array,
      tableLimit: React.PropTypes.shape({
        players: React.PropTypes.number,
        maxBuyIn: React.PropTypes.number
      }),
      numberOfDecks: React.PropTypes.number
    })
  }

  render () {
    let table = this.props.box;

    return (
      <div id={table.id} key={this.props.key} className='col-md-3 col-md-push-1 lobby-box no-select'>
        <div className='lobby-box-title col-md-12'>{table.name}</div>
        <div className='col-md-2 col-md-push-1 lobby-box-info'>
          {table.numberOfDecks}
          <span className='icomoon icomoon-stack'></span>
        </div>
        <div className='col-md-3 col-md-push-2 lobby-box-info'>
          {table.sittingPlayers.length} / {table.tableLimit.players}&nbsp;
          <span className='glyphicon glyphicon-user'></span>
        </div>
        <div className='col-md-5 col-md-push-2 lobby-box-info'>
          {table.tableLimit.maxBuyIn}&nbsp;
          <span className='glyphicon glyphicon-euro'></span>
        </div>
      </div>
    );
  }
}

export default LobbyBox;
