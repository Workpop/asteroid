import localStorage from '@workpop/localstorage';
import { expect } from 'chai';
import sinon from 'sinon';
import { createClass } from '../../../src';

import { onLogin, onLogout, resumeLogin } from '../../../src/common/login-method';

describe('`onLogin` function', () => {
  const onLoginParameters = {
    id: 'userId',
    token: 'token',
  };

  it('sets the `userId` property to `id`', () => {
    const instance = {
      emit: sinon.spy(),
    };
    onLogin.call(instance, onLoginParameters);
    expect(instance).to.have.property('userId', 'userId');
  });

  it('sets the `loggedIn` property to `true`', () => {
    const instance = {
      emit: sinon.spy(),
    };
    onLogin.call(instance, onLoginParameters);
    expect(instance).to.have.property('loggedIn', true);
  });

  it('writes the login `token` to `localStorage`', sinon.test(function () {
    const storage = this.stub(localStorage, 'setItem');
    const instance = {
      emit: sinon.spy(),
      endpoint: 'endpoint',
    };
    onLogin.call(instance, onLoginParameters);
    expect(storage).to.have.callCount(2);
    expect(storage).to.have.calledWith('Meteor.loginToken', 'token');
    expect(storage).to.have.calledWith('Meteor.userId', 'userId');
  }));

  it('emits the `loggedIn` event with the id of the logged in user', () => {
    const instance = {
      emit: sinon.spy(),
      endpoint: 'endpoint',
    };
    onLogin.call(instance, onLoginParameters);

    expect(instance.emit).to.be.callCount(1);
    expect(instance.emit).to.be.calledOn(instance);
    expect(instance.emit).to.be.calledWith('loggedIn', 'userId');
  });

  it('returns the id of the logged in user', () => {
    const instance = {
      emit: sinon.spy(),
    };
    expect(onLogin.call(instance, onLoginParameters)).to.eql('userId');
  });
});

describe('`onLogout` function', () => {
  it('sets the `userId` property to `null`', () => {
    const instance = {
      emit: sinon.spy(),
    };
    onLogout.call(instance);
    expect(instance).to.have.property('userId', null);
  });

  it('sets the `loggedIn` property to `false`', () => {
    const instance = {
      emit: sinon.spy(),
    };
    onLogout.call(instance);
    expect(instance).to.have.property('loggedIn', false);
  });

  it('deletes the login `token` from `localStorage`', sinon.test(function () {
    const storage = this.stub(localStorage, 'removeItem');
    const instance = {
      emit: sinon.spy(),
      endpoint: 'endpoint',
    };
    onLogout.call(instance);
    expect(storage).to.have.callCount(2);
    expect(storage).to.have.calledWith('Meteor.loginToken');
    expect(storage).to.have.calledWith('Meteor.userId');
  }));

  it('emits the `loggedOut` event', () => {
    const instance = {
      emit: sinon.spy(),
      endpoint: 'endpoint',
    };
    onLogout.call(instance);
    expect(instance.emit).to.be.callCount(1);
    expect(instance.emit).to.be.calledOn(instance);
    expect(instance.emit).to.be.calledWith('loggedOut');
  });

  it('returns a promise resolving to `null`', () => {
    const instance = {
      emit: sinon.spy(),
    };
    expect(onLogout.call(instance)).to.eql(null);
  });
});


describe('`resumeLogin` function', () => {

  it('tries logging in if a login token is found in `localStorage`', sinon.test(function () {
    this.stub(localStorage, 'getItem', () => {
      return 'loginToken';
    });
    const instance = {
      login: this.spy(),
      endpoint: 'endpoint',
    };

    resumeLogin.call(instance);

    expect(instance.login).to.have.callCount(1);
    expect(instance.login).to.have.calledOn(instance);
    expect(instance.login).to.have.been.calledWith({ resume: 'loginToken' });
  }));

  it("doesn't try logging in if no token is found in `localStorage`", sinon.test(function () {
    this.stub(localStorage, 'getItem', () => {
      return undefined;
    });
    const instance = {
      onLogout: this.spy(),
      login: this.spy(),
      emit: this.spy(),
      endpoint: 'endpoint',
    };

    resumeLogin.call(instance);
    expect(instance.onLogout).to.have.callCount(1);
    expect(instance.login).not.to.have.been.called;
  }));

});

