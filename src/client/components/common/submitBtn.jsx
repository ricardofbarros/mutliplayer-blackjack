import React, { Component } from 'react';

class TextInput extends Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <div className='form-group form-submit'>
        <div className='col-sm-12 controls'>
          <input type='submit' className='btn btn-primary' value={this.props.label} onClick={this.props.onClick}/>
        </div>
      </div>
    );
  }
}

export default TextInput;
