import React, {Component} from 'react';
import LobbyBox from '../lobbyBox/lobbyBox';
import './lobbyList.css';

class LobbyList extends Component {
  static propTypes = {
    tables: React.PropTypes.object
  }

  drawColumn (i, boxes) {
    return (
      <div key={i} className='col-md-12 lobby-col'>
        {boxes.map((box) => {
          return <LobbyBox key={box.id} box={box} />;
        })}
      </div>
    );
  }

  render () {
    let self = this;
    let tables = this.props.tables;

    let columns = [];
    let rows = [];
    let c = 0;
    let i = 0;

    tables.forEach(function (value) {
      c++;
      rows.push(value);

      // if this element is the last
      // print what we have
      if (i + 1 === tables.size) {
        columns.push(self.drawColumn(i, rows));
      }

      if (i % 3 === 2) {
        columns.push(self.drawColumn(i, rows));
        c = 0;
        rows = [];
      }

      i++;
    });

    return (
      <div>
        {columns.map((column) => {
          return column;
        })}
      </div>
    );
  }
}

export default LobbyList;
