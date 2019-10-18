import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button } from 'antd';

import UserPoliciesCard from './UserPoliciesCard';
import EditUserForm from '../user/EditUserForm';
import './RowDetail.less';
import { arborist } from '../../utils/API';
import { formatPolicies } from '../../utils/util';
import { connect } from 'react-redux';
import { loadUserList } from '../../actions';

class RowDetail extends Component {
  constructor (props) {
    super(props);
    const { user } = this.props;
    if (user) {
      this.state = {
        readOnly: true,
        userInfo: {
          username: {
            value: user.name,
          },
          email: {
            value: user.email,
          },
        },
        policies: user.policies,
      };
    }
  }

  handleEdit = () => {
    this.setState({
      readOnly: false,
    });
  };

  handleCancel = () => {
    const { user } = this.props;
    this.setState({
      readOnly: true,
      userInfo: {
        username: {
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
    const policiesFormData = this.UserPoliciesCard.submitEdit();
    const policies = formatPolicies(policiesFormData);
    try {
      await arborist.put(`/user/${this.props.user.name}`, {
        name: userInfo.username.value,
        email: userInfo.email.value,
        policies,
      });
      this.props.loadUserList();
    } catch (e) {
      console.log(e.message);
      return false;
    }

    this.setState({
      readOnly: true,
    });
  };

  renderEditButton = () => (
    <div className="actions">
      <Button>Disable</Button>
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
    this.UserPoliciesCard = ref;
  };


  render () {
    if (!this.props.user) {
      return (<div />);
    }
    const { readOnly, userInfo, policies } = this.state;
    return (
      <div className="row-detail">
        <div className="user-info">
          <div className="info-wrapper">
            <Avatar size={44} style={{ marginRight: 16 }}>
              {this.props.user.name.split(' ').slice(0, 2).map(
                w => w[0],
              )}
            </Avatar>
            {
              readOnly ? (
                <div className="info-inner">
                  <span className="user-name">{this.props.user.name}</span>
                  <span className="user-email">{this.props.user.email}</span>
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
        <UserPoliciesCard
          onRef={this.onRefUserPoliciesCard}
          readOnly={readOnly}
          policies={policies}
          key={this.props.user.name} // Replace with a unique field
        />
      </div>
    );
  }
}

RowDetail.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    policies: PropTypes.array,
  }),
};

RowDetail.defaultProps = {
  user: null,
};

const mapStateToProps = state => ({});


const mapDispatchToProps = {
  loadUserList,
};


export default connect(mapStateToProps, mapDispatchToProps)(RowDetail);
