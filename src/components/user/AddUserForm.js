import React from 'react';
import {
  Form, Button, Icon, Row, Col, Input,
} from 'antd';
import PropTypes from 'prop-types';

import './AddUserForm.less';

let id = 0;

class AddUser extends React.Component {
  componentDidMount () {
    this.props.onRef(this);
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id += 1);
    // can use data-binding to set
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  handleSubmit = () => this.props.form.validateFields((err, values) => {
    if (!err) {
      const { keys, users } = values;
      return keys.map(key => users[key]);
    }
    return err;
  });

  render () {
    const { form, ...other } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    if (keys.length === 0) {
      this.add();
    }

    const requireRule = {
      required: true,
      whitespace: true,
      message: 'Required',
    };

    const formItems = keys.map((key, index) => (
      <Row gutter={8} key={key}>
        <Col span={8}>
          <Form.Item
            required={false}
            className="add-user-form-item"
            {...other}
          >
            <label className="label" htmlFor={`name-${index}`}>
              User Name
              <Row>
                {getFieldDecorator(`users[${index}].name`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [requireRule],
                })(<Input style={{ width: '100%' }} id={`name-${index}`} />)}
              </Row>
            </label>
          </Form.Item>
        </Col>

        <Col span={14} className="form-item-col">
          <Form.Item
            required={false}
            className="add-user-form-item"
            {...other}
          >
            <label className="label" htmlFor={`email-${index}`}>
              Email Address
              {getFieldDecorator(`users[${index}].email`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [requireRule],
              })(<Input style={{ width: '100%' }} id={`email-${index}`} />)}
            </label>
          </Form.Item>
        </Col>
        <Col span={2} className="form-item-delete-item">
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(key)}
            />
          ) : null}
        </Col>
      </Row>
    ));

    return (
      <Row>
        <Col span={22} offset={2}>
          {formItems}
          <Button type="dashed" onClick={this.add} className="add-button" style={{}}>
            <Icon type="plus" /> Add field
          </Button>
        </Col>
      </Row>
    );
  }
}

AddUser.propTypes = {
  onRef: PropTypes.func,
  form: PropTypes.object.isRequired,
};

AddUser.defaultProps = {
  onRef: () => {
  },
};

const AddUserForm = Form.create({ name: 'add_user_form' })(AddUser);

export default AddUserForm;
