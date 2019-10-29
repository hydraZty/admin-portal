import React from 'react';
import {
  Form, Button, Icon, Row, Col, Input,
} from 'antd';
import PropTypes from 'prop-types';

import './AddUserForm.less';
import { fence } from '../../utils/API';

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

  remoteValidator = async (rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    try {
      const response = await fence.get(`admin/user/${value}`);
      if (response) {
        callback('Username exists in Fence');
      }
    } catch (e) {
      if (e.response.status === 404) {
        // Need return a callback, otherwise validator cannot respond
        callback();
      }
    }
  };

  render () {
    const { form, ...other } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('keys', {
      initialValue: [],
      validateFirst: true,
    });
    const keys = getFieldValue('keys');
    if (keys.length === 0) {
      this.add();
    }

    const requireRule = {
      required: true,
      whitespace: true,
      message: 'Required',
    };

    const existRule = {
      validator: this.remoteValidator,
    };

    const formItems = keys.map((key, index) => (
      <Row gutter={8} key={key}>
        <Col span={6}>
          <Form.Item
            required={false}
            className="add-user-form__form-item"
            {...other}
          >
            <label className="label" htmlFor={`name-${index}`}>
              User Name
              <Row>
                {getFieldDecorator(`users[${index}].name`, {
                  validateTrigger: ['onSubmit', 'onBlur'],
                  rules: [requireRule, existRule],
                })(<Input style={{ width: '100%' }} id={`name-${index}`} />)}
              </Row>
            </label>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            required={false}
            className="add-user-form__form-item"
            {...other}
          >
            <label className="label" htmlFor={`name-${index}`}>
              Display Name
              <Row>
                {getFieldDecorator(`users[${index}].preferred_username`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [requireRule],
                })(<Input style={{ width: '100%' }} id={`name-${index}`} />)}
              </Row>
            </label>
          </Form.Item>
        </Col>


        <Col span={10}>
          <Form.Item
            required={false}
            className="add-user-form__form-item"
            {...other}
          >
            <label className="add-user-form__label" htmlFor={`email-${index}`}>
              Email Address
              {getFieldDecorator(`users[${index}].email`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  type: 'email',
                  message: 'Invalid email format',
                }],
              })(<Input style={{ width: '100%' }} id={`email-${index}`} />)}
            </label>
          </Form.Item>
        </Col>
        <Col span={2} className="add-user-form__delete">
          {keys.length > 1 ? (
            <Icon
              type="minus-circle-o"
              onClick={() => this.remove(key)}
            />
          ) : null}
        </Col>
      </Row>
    ));

    return (
      <Row className="add-user-form">
        <Col span={22} offset={2}>
          {formItems}
          <Button type="dashed" onClick={this.add} className="add-user-form__add-button">
            <Icon type="plus" />
            Add field
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
