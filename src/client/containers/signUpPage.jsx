import React, { Component } from 'react';
import { Navigation } from 'react-router';
import SignUpForm from '../components/signUpForm';
import FormBox from '../components/common/formBox/formBox';
import UserApi from '../api/user';
import reactMixin from 'react-mixin';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { user as userValidation } from '../../common/validation';
import { config } from '../store/cookies';

@reactMixin.decorate(Navigation)
class SignUpPage extends Component {
  static propTypes = {
    session: React.PropTypes.object
  }

  constructor () {
    super();
    this.state = {
      data: { username: '', password: '', confirmPassword: '' }
    };
  }

  componentDidMount () {
    if (this.props.session.id) {
      this.transitionTo('app');
    }
  }

  setSignUpState (e) {
    let field = e.target.name;
    let value = e.target.value;
    this.state.data[field] = value;
    return this.setState({data: this.state.data});
  }

  async signUp (username, password, confirmPassword, e) {
    e.preventDefault();
    let payload = {
      username,
      password,
      confirmPassword
    };

    // Run common validation
    let isNotValid = userValidation(config.apiMsgState, payload);
    if (isNotValid) {
      return toastr.error(isNotValid);
    }

    let result = await UserApi.createNew(payload);

    if (result.error) {
      toastr.error(result.data.message);
    } else {
      toastr.success(result.data.message);
      this.transitionTo('app');
    }
  }

  render () {
    return (
      <div className='container'>
        <FormBox
          header='Sign Up'
          form={
            <SignUpForm
              data={this.state.data}
              onChange={this.setSignUpState.bind(this)}
              onSave={this.signUp.bind(this)} />
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

export default connect(mapStateToProps)(SignUpPage);
