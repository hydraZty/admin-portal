import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button } from 'antd';

import './RowDetail.less';
import { connect } from 'react-redux';
import { arborist, fence } from '../../utils/API';
import { formatPolicies } from '../../utils/util';
import { loadUserList } from '../../actions';
import EditUserForm from '../user/EditUserForm';
import UserInfoCard from './UserPoliciesCard';
import UserGroupsCard from './UserGroupCard';

class RowDetail extends Component {
  constructor (props) {
    super(props);
    const { user } = this.props;
    if (user) {
      this.state = {
        readOnly: true,
        userInfo: {
          // preferred_username or account
          username: {
            value: user.preferred_username || user.name,
          },
          // account
          name: {
            value: user.name,
          },
          email: {
            value: user.email,
          },
        },
        policies: user.policies,
        groups: user.groups_with_policies,
      };
    }
  }

  handleEdit = () => {
    this.setState({
      readOnly: false,
    });
  };

  handleDisable = async () => {
    await fence.put(`/admin/user/${this.props.user.name}`, {
      active: !this.props.user.active,
    });
    this.props.loadUserList();
  };

  handleCancel = () => {
    const { user } = this.props;
    this.setState({
      readOnly: true,
      userInfo: {
        username: {
          value: user.preferred_username || user.name,
        },
        name: {
          value: user.name,
        },
        email: {
          value: user.email,
        },
      },
    });
  };

  handleSave = async () => {
    const { userInfo } = this.state;
    const policiesFormData = this.UserInfoCard.submitEdit();
    const groupsFormData = this.UserGroupsCard.submitEdit();
    const groups = groupsFormData.map(group => group.name);
    const policies = formatPolicies(policiesFormData);
    try {
      await arborist.put(`/user/${this.props.user.name}`, {
        name: this.props.user.name,
        preferred_username: userInfo.username.value,
        email: userInfo.email.value,
        active: this.props.user.active,
        policies,
        groups,
      });
      this.props.loadUserList();
    } catch (e) {
      return false;
    }

    this.setState({
      readOnly: true,
    });
    return false;
  };

  renderEditButton = () => (
    <div className="actions">
      <Button onClick={this.handleDisable}>{this.props.user.active ? 'Disable' : 'Enable'}</Button>
      <Button type="primary" onClick={this.handleEdit}>Edit</Button>
    </div>
  );

  renderSaveButton = () => (
    <div className="actions">
      <Button onClick={this.handleCancel}>Cancel</Button>
      <Button type="primary" onClick={this.handleSave}>Save</Button>
    </div>
  );

  handleFormChange = changedFields => {
    this.setState(({ userInfo }) => ({
      userInfo: { ...userInfo, ...changedFields },
    }));
  };


  onRefUserPoliciesCard = (ref) => {
    this.UserInfoCard = ref;
  };

  onRefUserGroupsCard = (ref) => {
    this.UserGroupsCard = ref;
  };

  render () {
    if (!this.props.user) {
      return (<div />);
    }
    const {
      readOnly, userInfo, policies, groups,
    } = this.state;
    const name = this.props.user.preferred_username || this.props.user.name;
    return (
      <div className="row-detail">
        <div className="row-detail__user-info">
          <div className="row-detail__info-wrapper">
            <Avatar size={44} style={{ marginRight: 16 }}>
              {name.split(' ').slice(0, 2).map(
                w => w[0],
              )}
            </Avatar>
            {
              readOnly ? (
                <div className="row-detail__info-inner">
                  <span className="row-detail__user-name">{name}</span>
                  <span className="row-detail__user-email">{this.props.user.email}</span>
                </div>
              ) :
                <EditUserForm {...userInfo} onChange={this.handleFormChange} />
            }
          </div>
          {
            readOnly ?
              this.renderEditButton() :
              this.renderSaveButton()
          }
        </div>
        <UserInfoCard
          onRef={this.onRefUserPoliciesCard}
          readOnly={readOnly}
          policies={policies}
          key={this.props.user.name} // Replace with a unique field
        />
        <UserGroupsCard
          onRef={this.onRefUserGroupsCard}
          readOnly={readOnly}
          groups={groups}
          key={`group-${this.props.user.name}`}// Replace with a unique field
        />
      </div>
    );
  }
}

RowDetail.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    preferred_username: PropTypes.string,
    active: PropTypes.bool,
    email: PropTypes.string,
    policies: PropTypes.array,
    groups_with_policies: PropTypes.array,
  }),
  loadUserList: PropTypes.func,
};

RowDetail.defaultProps = {
  user: null,
  loadUserList: () => {},
};


const mapDispatchToProps = {
  loadUserList,
};


export default connect(null, mapDispatchToProps)(RowDetail);
