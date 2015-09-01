import React, { Component } from 'react';
import Spin from 'spin.js';

class Spinner extends Component {
  static propTypes = {
    config: React.PropTypes.object,
    stopped: React.PropTypes.bool
  }

  componentDidMount () {
    this.spinner = new Spin(this.props.config);
    this.spinner.spin(this.refs.container.getDOMNode());
  }

  componentWillReceiveProps (newProps) {
    if (newProps.stopped === true && !this.props.stopped) {
      this.spinner.stop();
    } else if (!newProps.stopped && this.props.stopped === true) {
      this.spinner.spin(this.refs.container.getDOMNode());
    }
  }

  componentWillUnmount () {
    this.spinner.stop();
  }

  render () {
    return (
      <span ref='container'></span>
    );
  }
}

export default Spinner;
