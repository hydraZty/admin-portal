import React, { Component } from 'react';
import { Button } from 'antd';

import { fence } from '../../utils/API';

import './MockLoginPage.less';

class LoginPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      providers: [],
    };
  }

  componentDidMount () {
    document.title = 'Login';
    this.loadLoginProviders();
  }

  loadLoginProviders = async () => {
    const resp = await fence.get('/login');
    const providers = resp.providers || [];
    this.setState({
      providers,
    });
  }

  onLogin = async (provider) => {
    const { location } = window;
    window.location.href = `${provider.url}?redirect=${location.href}`;
  }

  render () {
    return (
      <div className="login-page">
        {this.state.providers.map(provider => (
          <Button
            className="login-button"
            type="default"
            key={provider.id}
            onClick={() => this.onLogin(provider)}
            block
          >{provider.name}
          </Button>
        ))}
      </div>
    );
  }
}

export default LoginPage;
