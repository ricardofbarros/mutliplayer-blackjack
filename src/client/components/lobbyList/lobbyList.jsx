import React, {Component} from 'react';
import LobbyBox from '../lobbyBox/lobbyBox';
import './lobbyList.css';

class LobbyList extends Component {
  static propTypes = {
    tables: React.PropTypes.array
  }

  drawColumn (boxes) {
    return (
      <div className='col-md-12 lobby-col'>
        {boxes.map((box) => {
          console.log(box)
          return <LobbyBox box={box} />;
        })}
      </div>
    );
  }

  drawRow (table) {

  }

  render () {
    let tables = this.props.tables;

    let columns = [];
    let rows = [];
    let c = 0;
    for (let i = 0; i < tables.length; i++) {
      c++;
      rows.push(tables[i]);

      // if next element is the last onSave
      // print what we have
      if (i + 1 === tables.length) {
        columns.push(this.drawColumn(rows));
      }

      if (i % 3 === 2) {
        columns.push(this.drawColumn(rows));

        c = 0;
        rows = [];
      }
    }

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
