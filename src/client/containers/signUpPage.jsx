import React, { Component } from 'react';
import { Navigation } from 'react-router';
import SignUpForm from '../components/signUpForm';
import FormBox from '../components/common/formBox/formBox';
import UserApi from '../api/user';
import reactMixin from 'react-mixin';
import toastr from 'toastr';
import { connect } from 'react-redux';

@reactMixin.decorate(Navigation)
class SignUpPage extends Component {
  constructor () {
    super();
    this.state = {
      data: { username: '', password: '', confirmPassword: '' }
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.session.id) {
      this.transitionTo('app');
    }
  }

  setSignUpState (e) {
    let field = e.target.name;
    let value = e.target.value;
    this.state.data[field] = value;
    return this.setState({data: this.state.data});
  }

  async signUp (user, pass, confirmPass, e) {
    e.preventDefault();
    let result = await UserApi.createNew(user, pass, confirmPass);

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
        header='Sign Up'
        form={
          <SignUpForm
            data={this.state.data}
            onChange={this.setSignUpState.bind(this)}
            onSave={this.signUp.bind(this)} />
        } />
    );
  }
}

SignUpPage.propTypes = {
  session: React.PropTypes.object
};

function mapStateToProps (state) {
  return {
    session: state.session
  };
}

export default connect(mapStateToProps)(SignUpPage);
