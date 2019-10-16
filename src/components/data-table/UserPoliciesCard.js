import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Tag } from 'antd';

import './UserPoliciesCard.less';
import { formatResourceName } from '../../utils/util';

class UserPoliciesCard extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const policies = (
      <table className="card-table">
        <tbody>{
          this.props.policies.map(policy => (
            <tr key={policy.role}>
              <td className="role-name">{policy.role}</td>
              <td>
                {policy.resources && policy.resources.map(resource => (
                  <Tag
                    color="#e7e7e7"
                    key={resource.policy}
                    style={{
                      color: '#3283c8',
                      marginBottom: 4,
                      marginLeft: 2,
                      marginRight: 2,
                    }}
                  >
                    {formatResourceName(resource.resource)}
                  </Tag>
                ))}
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    );
    return (
      <Card title="User Policies" bordered={false} className="row-detail-card">
        {policies}
      </Card>
    );
  }
}

UserPoliciesCard.propTypes = {
  policies: PropTypes.array.isRequired,
};


export default UserPoliciesCard;
