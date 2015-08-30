import React, { Component } from 'react';

class Header extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    money: React.PropTypes.number.isRequired
  }

  render () {
    return (
      <nav className='navbar navbar-inverse'>
        <div className='container-fluid'>
          <ul className='nav navbar-nav navbar-right'>
            <li><b>{this.props.name}</b></li>
            <li>Balance: {this.props.money}&euro;</li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
