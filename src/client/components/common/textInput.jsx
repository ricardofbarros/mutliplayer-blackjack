import React, { Component } from 'react';

class Input extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    placeHolder: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    label: React.PropTypes.boolean,
    error: React.PropTypes.string,
    glyph: React.PropTypes.string,
    password: React.PropTypes.boolean
  }

  render () {
    var wrapperClass = 'field';

    if (this.props.glyph) {
      wrapperClass += ' input-group';
    } else if (this.props.label) {
      wrapperClass += ' form-group';
    }

    // Check for errors
    if (this.props.error && this.props.error.lenght > 0) {
      wrapperClass += ' has-error';
    }

    // Default type
    let type = 'text';
    if (this.props.password) {
      type = 'password';
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
          } else if (props.label) {
            return (
              <label htmlFor={props.name} className='col-md-3 control-label'>{props.placeHolder}</label>
            );
          }
        })(this.props)}
        <div className={((flag) => { if (flag) return 'col-md-9'; })(this.props.label)}>
          <input type={type}
            name={this.props.name}
            className='form-control'
            placeholder={this.props.placeHolder}
            ref={this.props.name}
            value={this.props.value}
            onChange={this.props.onChange} />
          </div>
          <div className='input'>{this.props.error}</div>
      </div>
    );
  }
}

export default Input;
