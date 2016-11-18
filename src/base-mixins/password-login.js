/*
 *   The password-login mixin:
 *   - defines the `createUser` and `loginWithPassword` methods, porcelain for
 *     calling the `createUser` and `login` ddp methods
 */


/*
 *   Public methods
 */

export function createUser(options) {
  return this.call('createUser', options).then((data) => {
    return this.onLogin(data);
  });
}

export function loginWithPassword({ username, email, password }) {
  return this.call('login', {
    email,
    username,
  }, password).then((data) => {
    return this.onLogin(data);
  });
}
