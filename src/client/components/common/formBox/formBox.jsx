import React, { Component } from 'react';
import './formBox.css';

class FormBox extends Component {
  static propTypes = {
    header: React.PropTypes.string.isRequired,
    form: React.PropTypes.element.isRequired
  }

  render () {
    return (
      <div className='container'>
        <div className='formBox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2'>
          <div className='panel panel-info' >
            <div className='panel-heading'>
              <div className='panel-title'>{this.props.header}</div>
            </div>
            <div className='panel-body'>{this.props.form}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default FormBox;
