import React from 'react';
import {
  Form, Icon, Row, Col, Select, Tag, TreeSelect,
} from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './AssignPermissionForm.less';
import { formatResourceName } from '../../utils/util';


class AssignPermission extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      results: [], // Select component results
      policyData: this.props.policies,
    };
  }

  componentDidMount () {
    this.props.onRef(this);
  }

  onChange = results => {
    this.setState({ results });
  };

  handleSubmit = () => this.state.policyData;

  removeRole = (index) => {
    this.state.policyData.splice(index, 1);
    this.setState(prevState => ({
      policyData: prevState.policyData,
    }));
  };

  removeResource = (rowIndex, resourceIndex) => {
    this.state.policyData[rowIndex].resources.splice(resourceIndex, 1);
    this.setState(prevState => ({
      policyData: prevState.policyData,
    }));
  };

  AddRole = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newValues = {};
        newValues.role = values.role.label;
        newValues.resources = values.resources ? values.resources.map(resource => {
          let { value } = resource;
          value = JSON.parse(value);
          return {
            policy: `${value.path.slice(1).replace(/\//ig, '.')}-${newValues.role}`,
            resource: value.name,
          };
        }) : [];
        this.setState(prevState => ({
          policyData: prevState.policyData.concat(newValues),
        }));
        this.props.form.resetFields();
        return true;
      }
      return err;
    });
  };

  renderTreeNodes = (data, disable = false) => data.map(item => {
    // Removed from the results when the node was disabled
    if (disable) {
      _.remove(this.state.results, (r) => r.value === item.path);
    }
    const value = {
      path: item.path,
      name: item.name,
    };
    let disableChildren;
    if (disable) {
      // Child nodes recursively disabled
      disableChildren = true;
    } else {
      const values = this.state.results.map(v => {
        const temp = JSON.parse(v.value);
        return temp.path;
      });
      disableChildren = values.includes(item.path);
    }
    return (
      <TreeSelect.TreeNode
        title={formatResourceName(item.name)}
        key={JSON.stringify(value)}
        value={JSON.stringify(value)}
        className={item.namespace ? 'assign-permission-form__tree-node--disabled' : null}
        disabled={disable}
        disableCheckbox={!!item.namespace}
      >
        { item.children && item.children.length > 0 ?
          this.renderTreeNodes(item.children, disableChildren) : null }
      </TreeSelect.TreeNode>
    );
  });

  render () {
    const { form, readOnly } = this.props;
    const { getFieldDecorator } = form;

    const filteredRoleOptions = this.props.roleOptions.filter(o => {
      const keys = this.state.policyData.map(i => i.role);
      return !keys.includes(o.id);
    });

    return (
      <div>{readOnly ? null : (
        <Row>
          <Form>
            <Col span={8}>
              <Form.Item className="assign-permission-form__form-item">
                {getFieldDecorator('role', {
                  rules: [{ required: true, message: 'Select role' }],
                })(
                  <Select
                    labelInValue
                    showSearch
                    style={{ width: '95%' }}
                    placeholder="Select role"
                  >
                    {filteredRoleOptions.map(r => (
                      <Select.Option
                        value={r.id}
                        key={r.id}
                      >{r.id}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item className="assign-permission-form__form-item">
                {getFieldDecorator('resources', {
                  rules: [
                    { required: false, type: 'array' },
                  ],
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    allowClear
                    labelInValue
                    showSearch
                    multiple
                    treeCheckable
                    treeCheckStrictly
                    filterTreeNode={((inputValue, treeNode) => (
                      _.lowerCase(treeNode.props.title).indexOf(_.lowerCase(inputValue)) >= 0
                    ))}
                    onChange={this.onChange}
                    placeholder="Select resource (Searchable)"
                    treeDefaultExpandedKeys={['default']}
                  >
                    {this.renderTreeNodes(this.props.resourceOptions)}
                  </TreeSelect>,
                )}
              </Form.Item>
            </Col>

            <Col span={2} className="assign-permission-form__add-role">
              <div
                className="assign-permission-form__icon-wrapper"
                onClick={this.AddRole}
                role="presentation"
                onKeyPress={this.AddRole}
              >
                <Icon type="plus" />
              </div>
            </Col>
          </Form>
        </Row>
      )}{this.state.policyData.map((row, roleIndex) => (
        <Row className="assign-permission-form__list-row" key={`role-list-${row.role}`}>
          <Col span={8} className="assign-permission-form__list-item">
            {row.role}
          </Col>
          <Col span={14} className="resource">
            {row.resources && row.resources.map((resource, resourceIndex) => (
              resource.resource ? (
                <Tag
                  color="#eeedf5"
                  key={resource.resource}
                  className="resource__tag"
                  closable={!readOnly}
                  onClose={() => this.removeResource(roleIndex, resourceIndex)}
                >
                  {formatResourceName(resource.resource)}
                </Tag>
              ) : null
            ))}
          </Col>
          {readOnly ? null : (
            <Col span={2} className="assign-permission-form__add-role">
              <div
                role="presentation"
                onKeyPress={() => this.removeRole(roleIndex)}
                className="assign-permission-form__icon-wrapper"
                onClick={() => this.removeRole(roleIndex)}
              >
                <Icon type="plus" rotate={45} />
              </div>
            </Col>
          )}
        </Row>
      ))}
      </div>
    );
  }
}

AssignPermission.propTypes = {
  onRef: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  roleOptions: PropTypes.array,
  resourceOptions: PropTypes.array,
  readOnly: PropTypes.bool,
  policies: PropTypes.array,
};

AssignPermission.defaultProps = {
  roleOptions: [],
  resourceOptions: [],
  readOnly: false,
  policies: [],
};

const AssignPermissionForm = Form.create({ name: 'assign_permission_form' })(
  AssignPermission,
);


export default AssignPermissionForm;
