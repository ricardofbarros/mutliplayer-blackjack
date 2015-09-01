import React, {Component} from 'react';
import { Navigation } from 'react-router';
import LoginForm from '../components/loginForm';
import FormBox from '../components/common/formBox/formBox';
import SessionApi from '../api/session';
import reactMixin from 'react-mixin';
import toastr from 'toastr';
import Cookies from '../store/cookies';
import { connect } from 'react-redux';

@reactMixin.decorate(Navigation)
class LoginPage extends Component {
  constructor () {
    super();
    this.state = {
      login: { username: '', password: '' }
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.session.id) {
      this.transitionTo('app');
    }
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
      Cookies.set('accessToken', result.data.accessToken);
      this.transitionTo('app');
    }
  }

  render () {
    return (
      <div className='container'>
        <FormBox
          header='Sign In'
          form={
            <LoginForm
              login={this.state.login}
              onChange={this.setLoginState.bind(this)}
              onClick={this.login.bind(this)} />
            } />
      </div>
    );
  }
}

LoginPage.propTypes = {
  session: React.PropTypes.object
};

function mapStateToProps (state) {
  return {
    session: state.session
  };
}

export default connect(mapStateToProps)(LoginPage);
