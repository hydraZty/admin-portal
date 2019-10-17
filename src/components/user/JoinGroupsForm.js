import React from 'react';
import {
  Form, Icon, Row, Col, Select,
} from 'antd';
import PropTypes from 'prop-types';

import { arborist } from '../../utils/API';
import './JoinGroupsForm.less';


class JoinGroups extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      groupOptions: [],
      groupData: [],
    };
  }

  componentDidMount () {
    this.props.onRef(this);
    this.loadGroupOptions();
  }

  loadGroupOptions = async () => {
    const resp = await arborist.get('/group');
    this.setState({
      groupOptions: resp.groups,
    });
  };

  handleSubmit = () => this.state.groupData;

  AddGroup = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(pervState => ({
          groupData: pervState.groupData.concat(values),
        }));
        this.props.form.resetFields();
      } else {
        return err;
      }
      return true;
    });
  };

  removeGroup = (index) => {
    this.state.groupData.splice(index, 1);
    this.setState(prevState => ({
      groupData: prevState.groupData,
    }));
  };

  render () {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    // Filter the options has added
    const filteredGroupOptions = this.state.groupOptions.filter(o => {
      let keys = this.state.groupData.map(i => i.group.key);
      keys = keys.concat(['anonymous', 'logged-in']);
      return !keys.includes(o.name);
    });

    return (
      <Row>
        <Row>
          <Form>
            <Col span={22}>
              <Form.Item className="group-form-item">
                {getFieldDecorator('group', {
                  rules: [{ required: true, message: 'Required' }],
                })(
                  <Select
                    labelInValue
                    showSearch
                    showArrow={false}
                    style={{ width: '98%' }}
                    placeholder="Enter group name keyword"
                  >
                    {filteredGroupOptions.map(
                      r => <Select.Option value={r.name}>{r.name}</Select.Option>,
                    )}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={2} className="add-button-col">
              <div
                role="presentation"
                className="icon-wrapper"
                onClick={this.AddGroup}
                onKeyPress={this.AddGroup}
              >
                <Icon type="plus" />
              </div>
            </Col>
          </Form>
        </Row>
        {
          this.state.groupData.map((row, index) => (
            <Row className="group-list-row">
              <Col span={22} className="group-list-item">
                {row.group.label}
              </Col>
              <Col span={2} className="delete-button-col">
                <div
                  role="presentation"
                  className="icon-wrapper"
                  onClick={() => this.removeGroup(index)}
                  onKeyPress={() => this.removeGroup(index)}
                >
                  <Icon type="plus" rotate={45} />
                </div>
              </Col>
            </Row>
          ))
        }
      </Row>
    );
  }
}

JoinGroups.propTypes = {
  onRef: PropTypes.func,
  form: PropTypes.object.isRequired,
};

JoinGroups.defaultProps = {
  onRef: () => {
  },
};

const JoinGroupsForm = Form.create({ name: 'join_groups_form' })(JoinGroups);


export default JoinGroupsForm;
