import React, {Component} from 'react';
import { Navigation } from 'react-router';
import LoginForm from './loginForm';
import FormBox from '../common/formBox/formBox';
import SessionApi from '../../api/session';
import reactMixin from 'react-mixin';
import toastr from 'toastr';

@reactMixin.decorate(Navigation)
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

  async login (user, pass, e) {
    e.preventDefault();
    let result = await SessionApi.signIn(user, pass);

    if (result.error) {
      toastr.error(result.data.message);
    } else {
      toastr.success(result.data.message);
      this.transitionTo('app');
    }
  }

  render () {
    return (
      <FormBox
        header='Sign In'
        form={
          <LoginForm
            login={this.state.login}
            onChange={this.setLoginState.bind(this)}
            onClick={this.login.bind(this)} />
          } />
    );
  }

}

export default LoginPage;
