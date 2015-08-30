import React, { Component } from 'react';

class Input extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    placeHolder: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    error: React.PropTypes.string,
    glyph: React.PropTypes.string,
    type: React.PropTypes.string
  }

  render () {
    var wrapperClass = 'field input-group';
    if (this.props.error && this.props.error.lenght > 0) {
      wrapperClass += ' has-error';
    }

    // Default value
    if (!this.props.type) {
      this.props.type = 'text';
    }

    return (
      <div className={wrapperClass}>
        {((props) => {
          if (props.glyph) {
            let glyph = 'glyphicon ' + props.glyph;
            return (
              <span className='input-group-addon'>
                <i className={glyph}></i>
              </span>
            );
          }
        })(this.props)}
        <input type={this.props.type}
          name={this.props.name}
          className='form-control'
          placeholder={this.props.placeHolder}
          ref={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange} />
          <div className='input'>{this.props.error}</div>
      </div>
    );
  }
}

export default Input;
