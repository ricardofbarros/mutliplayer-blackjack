import React, {Component} from 'react';
import Input from '../common/input';

class LoginForm extends Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    login: React.PropTypes.object.isRequired
  }

  render () {
    return (
      <form className='form-horizontal'>
        <Input
          name='username'
          onChange={this.props.onChange}
          placeHolder='Username'
          value={this.props.login.username}
          glyph='glyphicon-user' />

          <Input
            name='password'
            onChange={this.props.onChange}
            placeHolder='Password'
            glyph='glyphicon-lock'
            value={this.props.login.password}
            type='password' />

          <div className='form-group form-submit'>
            <div className='col-sm-12 controls'>
              <a id='btn-login' href='#' className='btn btn-primary'>Login</a>
            </div>
          </div>
      </form>
    );
  }
}

export default LoginForm;
