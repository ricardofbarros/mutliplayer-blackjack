import React, {Component} from 'react';
import { Navigation } from 'react-router';
import LoginForm from '../components/loginForm';
import FormBox from '../components/common/formBox/formBox';
import SessionActions from '../actions/session';
import reactMixin from 'react-mixin';
import toastr from 'toastr';
import Cookies from '../store/cookies';
import { connect } from 'react-redux';

@reactMixin.decorate(Navigation)
class LoginPage extends Component {
  static propTypes = {
    session: React.PropTypes.object,
    login: React.PropTypes.func,
    getUserInfo: React.PropTypes.func
  }

  constructor () {
    super();
    this.state = {
      login: { username: '', password: '' }
    };
  }

  componentDidMount () {
    if (this.props.session.id) {
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
    let result = await this.props.login(user, pass);

    if (result.error) {
      toastr.error(result.payload.message);
    } else {
      Cookies.set('accessToken', result.payload.accessToken);
      toastr.success(result.payload.message);
      this.props.getUserInfo(result.payload.accessToken);
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

function mapStateToProps (state) {
  return {
    session: state.session
  };
}

export default connect(
  mapStateToProps,
  {...SessionActions}
)(LoginPage);
