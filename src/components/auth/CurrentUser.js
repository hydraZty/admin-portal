import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Button, Modal } from 'antd';
import PropTypes from 'prop-types';

import { loadUserData } from '../../actions';
import MockLoginPage from './MockLoginPage';
import './CurrentUser.less';


const mapStateToProps = state => ({
  user: state.user.currentUser,
});


const mapDispatchToProps = (dispatch) => ({
  loadUser: () => dispatch(loadUserData()),
});


class CurrentUser extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loginModalVisible: false,
    };
  }

  componentDidMount() {
    this.props.loadUser().then(() => {});
  }

  showLogin = () => {
    this.setState({ loginModalVisible: true });
  }

  handleCancel = () => {
    this.setState({ loginModalVisible: false });
  }

  render () {
    let user;
    if (this.props.user) {
      user = (
        <div className="avatar-container">
          <Avatar icon="user" className="avatar" />
          <span className="user-name">{this.props.user.username}</span>
        </div>
      );
    } else {
      user = <Button type="link" onClick={this.showLogin}>Login</Button>;
    }
    return (
      <div className="user-container">
        {user}
        <Modal
          title="Mock Login"
          maskClosable
          visible={this.state.loginModalVisible}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
        >
          <MockLoginPage />
        </Modal>
      </div>
    );
  }
}

CurrentUser.propTypes = {
  loadUser: PropTypes.func,
  user: PropTypes.object,
};

CurrentUser.defaultProps = {
  loadUser: () => {},
  user: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUser);
