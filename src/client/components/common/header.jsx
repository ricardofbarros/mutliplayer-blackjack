import React, { Component } from 'react';

class Header extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    money: React.PropTypes.number.isRequired,
    onClick: React.PropTypes.func.isRequired
  }

  render () {
    let money = this.props.money + '.';
    money = money.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    money = money.substring(0, money.length - 1);

    return (
      <nav className='navbar navbar-inverse'>
        <div className='container'>
          <ul className='nav navbar-nav navbar-left'>
            <li>Welcome, <b>{this.props.name}</b></li>
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li> Current balance:&nbsp;
              <b>
                {money}
                <span className='glyphicon glyphicon-euro'></span>
              </b>
            </li>
            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li>
              <button type='button' className='btn btn-danger' onClick={this.props.onClick}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
