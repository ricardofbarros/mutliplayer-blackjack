import React, {Component} from 'react';
import {Link} from 'react-router';
import TextInput from './common/textInput';
import SubmitBtn from './common/submitBtn';

class SignUpForm extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired
  }

  render () {
    let onSave = this.props.onSave.bind(null,
      this.props.data.username,
      this.props.data.password,
      this.props.data.confirmPassword
    );

    return (
      <form className='form-horizontal'>
        <TextInput
          name='username'
          onChange={this.props.onChange}
          placeHolder='Username'
          label={true}
          value={this.props.data.username} />

          <TextInput
            name='password'
            onChange={this.props.onChange}
            placeHolder='Password'
            label={true}
            value={this.props.data.password}
            password={true} />

            <TextInput
              name='confirmPassword'
              onChange={this.props.onChange}
              placeHolder='Confirm Password'
              label={true}
              value={this.props.data.confirmPassword}
              password={true} />

          <SubmitBtn label='Register' onClick={onSave}/>
          <div className='form-group'>
              <div className='col-md-12 control'>
                  <div className='form-extra'>
                      <Link to='app'>Go back</Link>
                  </div>
              </div>
          </div>
      </form>
    );
  }
}

export default SignUpForm;
