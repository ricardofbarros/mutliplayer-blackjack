import React, {Component} from 'react';
import SignUpForm from './signUpForm';
import FormBox from '../common/formBox/formBox';

class SignUpPage extends Component {
  constructor () {
    super();
    this.state = {
      data: { username: '', password: '', confirmPassword: '' }
    };
  }

  setLoginState (e) {
    let field = e.target.name;
    let value = e.target.value;
    this.state.login[field] = value;
    return this.setState({login: this.state.login});
  }

  render () {
    return (
      <FormBox
        header='Sign Up'
        form={<SignUpForm data={this.state.data} onChange={this.setLoginState}/>}/>
    );
  }

}

export default SignUpPage;
