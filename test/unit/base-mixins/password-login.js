import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { createUser, loginWithPassword } from '../../../src/base-mixins/password-login';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('`passwordLogin` mixin', () => {

  describe('`createUser` method', () => {

    it('should call the `call` instance method with the correct parameters', () => {
      const instance = {
        call: sinon.stub().returns(Promise.resolve({})),
      };
      const parameters = {
        email: 'test@email.com',
        password: 'password',
      };
      const expectedParameter = {
        password: 'password',
        email: 'test@email.com',
      };
      createUser.call(instance, parameters);
      expect(instance.call).to.have.been.calledWith('createUser', expectedParameter);
    });

    it('should call the `onLogin` function when the `call` instance method is resolved', () => {
      const instance = {
        onLogin: sinon.spy(),
        call: sinon.stub().returns(Promise.resolve({})),
      };
      const options = {
        email: 'test@email.com',
        username: 'username',
        password: 'password',
      };
      return createUser.call(instance, options)
        .then(() => {
          expect(instance.onLogin).to.have.callCount(1);
        });
    });

  });

  describe('`loginWithPassword` method', () => {

    it('should call the `call` instance method with the correct parameters', () => {
      const instance = {
        call: sinon.stub().returns(Promise.resolve({})),
      };
      const options = {
        email: 'test@email.com',
        username: 'username',
        password: 'password',
      };
      const expectedParameter = {
        username: 'username',
        email: 'test@email.com',
      };
      loginWithPassword.call(instance, options);
      expect(instance.call).to.have.been.calledWith('login', expectedParameter, 'password');
    });

    it('should call the `onLogin` function when the `call` instance method is resolved', () => {
      const instance = {
        onLogin: sinon.spy(),
        call: sinon.stub().returns(Promise.resolve({})),
      };
      const options = {
        email: 'test@email.com',
        username: 'username',
        password: 'password',
      };
      return loginWithPassword.call(instance, options)
        .then(() => {
          expect(instance.onLogin).to.have.callCount(1);
        });
    });
  });
});
