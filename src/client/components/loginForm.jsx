import React, {Component} from 'react';
import {Link} from 'react-router';
import TextInput from './common/textInput';
import SubmitBtn from './common/submitBtn';

class LoginForm extends Component {
  static propTypes = {
    login: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired
  }

  render () {
    let onClick = this.props.onClick.bind(null,
      this.props.login.username,
      this.props.login.password
    );

    return (
      <form className='form-horizontal'>
        <TextInput
          name='username'
          onChange={this.props.onChange}
          placeHolder='Username'
          value={this.props.login.username}
          glyph='glyphicon-user' />

          <TextInput
            name='password'
            onChange={this.props.onChange}
            placeHolder='Password'
            glyph='glyphicon-lock'
            value={this.props.login.password}
            password={true} />

          <SubmitBtn label='Login' onClick={onClick}/>
          <div className='form-group'>
              <div className='col-md-12 control'>
                  <div className='form-extra'>
                      {'Don\'t have an account? '}
                      <Link to='sign-up'>Sign up here</Link>
                  </div>
              </div>
          </div>
      </form>
    );
  }
}

export default LoginForm;
