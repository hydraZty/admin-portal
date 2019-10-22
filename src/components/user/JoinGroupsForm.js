import React from 'react';
import {
  Form, Icon, Row, Col, Select,
} from 'antd';
import PropTypes from 'prop-types';

import './JoinGroupsForm.less';

class JoinGroups extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      groupData: this.props.groups,
    };
  }

  componentDidMount () {
    this.props.onRef(this);
  }

  handleSubmit = () => this.state.groupData;

  AddGroup = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(pervState => ({
          groupData: pervState.groupData.concat({ name: values.group.key }),
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
    const { form, readOnly } = this.props;
    const { getFieldDecorator } = form;

    // Filter the options has added
    const filteredGroupOptions = this.props.groupOptions.filter(o => {
      let keys = this.state.groupData.map(i => i.name);
      keys = keys.concat(['anonymous', 'logged-in']);
      return !keys.includes(o.name);
    });

    return (
      <Row>{readOnly ? null : (
        <Row>
          <Form>
            <Col span={22}>
              <Form.Item className="join-groups-form__form-item">
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

            <Col span={2} className="join-groups-form__button-col">
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
      )}{this.state.groupData.map((group, index) => (
        <Row className="join-groups-form__result">
          <Col span={22}>
            {group.name}
          </Col>
          {readOnly ? null : (
            <Col span={2} className="join-groups-form__button-col">
              <div
                role="presentation"
                className="join-groups-form__icon-wrapper"
                onClick={() => this.removeGroup(index)}
                onKeyPress={() => this.removeGroup(index)}
              >
                <Icon type="plus" rotate={45} />
              </div>
            </Col>
          )}
        </Row>
      ))}
      </Row>
    );
  }
}

JoinGroups.propTypes = {
  onRef: PropTypes.func,
  form: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  groups: PropTypes.array,
  groupOptions: PropTypes.array,
};

JoinGroups.defaultProps = {
  onRef: () => {
  },
  readOnly: false,
  groups: [],
  groupOptions: [],
};

const JoinGroupsForm = Form.create({ name: 'join_groups_form' })(JoinGroups);


export default JoinGroupsForm;
