import React, { Component } from 'react';

class Input extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    placeHolder: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    error: React.PropTypes.string
  }

  render () {
    var wrapperClass = 'form-group';
    if (this.props.error && this.props.error.lenght > 0) {
      wrapperClass += ' has-error';
    }

    return (
      <div className={wrapperClass}>
        <div className='field'>
          <input type='text'
            name={this.props.name}
            className='form-control'
            placeHolder={this.props.placeHolder}
            ref={this.props.name}
            value={this.props.value}
            onChange={this.props.onChange} />
            <div className='input'>{this.props.error}</div>
          </div>
      </div>

    );
  }
}

export default Input;
