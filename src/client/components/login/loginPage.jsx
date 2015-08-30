import React, {Component} from 'react';
import LoginForm from './loginForm';
import FormBox from '../common/formBox/formBox';

class LoginPage extends Component {
  constructor () {
    super();
    this.state = {
      login: { username: '', password: '' }
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
        header='Sign In'
        form={<LoginForm login={this.state.login} onChange={this.setLoginState.bind(this)}/>}/>
    );
  }

}

export default LoginPage;
