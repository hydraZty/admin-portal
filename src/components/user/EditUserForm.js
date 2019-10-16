import React from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

import './AddUserForm.less';


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
})(class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

    static propTypes = {
      onRef: PropTypes.func.isRequired,
      form: PropTypes.any.isRequired,
    }

    handleSubmit = () => this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      } else {
        return err;
      }
    })

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
            className="add-user-form-item"
          >
            { getFieldDecorator('username', {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [requireRule],
            })(<Input style={{ width: '100%' }} />) }
          </Form.Item>

          <Form.Item
            required={false}
            className="add-user-form-item"
          >
            { getFieldDecorator('email', {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [requireRule],
            })(<Input style={{ width: '100%' }} />) }
          </Form.Item>
        </Form>
      );
    }
});

export default AddUserForm;
