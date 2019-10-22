import React from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

import './EditUserForm.less';


class AddUser extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const requireRule = {
      required: true,
      whitespace: true,
      message: 'Required',
    };
    return (
      <Form>
        <Form.Item
          required={false}
          className="edit-user-form__form-item"
        >
          { getFieldDecorator('username', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [requireRule],
          })(<Input style={{ width: '100%' }} />) }
        </Form.Item>

        <Form.Item
          required={false}
          className="edit-user-form__form-item"
        >
          { getFieldDecorator('email', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [requireRule],
          })(<Input style={{ width: '100%' }} />) }
        </Form.Item>
      </Form>
    );
  }
}
const AddUserForm = Form.create({
  name: 'edit_user_form',
  onFieldsChange (props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      username: Form.createFormField({
        value: props.username.value,
      }),
      email: Form.createFormField({
        value: props.email.value,
      }),
    };
  },
})(AddUser);

AddUser.propTypes = {
  form: PropTypes.object.isRequired,
};

export default AddUserForm;
