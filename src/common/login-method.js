import localStorage from '@workpop/localstorage';

// Key names to use in localStorage
const DEFAULT_LOGIN_EXPIRATION_DAYS_IN_MS = 90 * 24 * 60 * 60 * 1000;
const LOGIN_TOKEN_KEY = 'Meteor.loginToken';
const LOGIN_TOKEN_EXPIRES_KEY = 'Meteor.loginTokenExpires';
const USER_ID_KEY = 'Meteor.userId';

function tokenExpiration(when) {
  return new Date((new Date(when)).getTime() + DEFAULT_LOGIN_EXPIRATION_DAYS_IN_MS);
}

export function onLogin({ id, token }) {
  this.userId = id;
  this.loggedIn = true;

  localStorage.setItem(USER_ID_KEY, id);
  localStorage.setItem(LOGIN_TOKEN_KEY, token);

  const tokenExpires = localStorage.getItem(LOGIN_TOKEN_EXPIRES_KEY);

  if (!tokenExpires) {
    localStorage.setItem(LOGIN_TOKEN_EXPIRES_KEY, tokenExpiration(new Date()));
  }

  // emit the logged in event to all clients
  this.emit('loggedIn', id);

  return id;
}

export function onLogout() {
  this.userId = null;
  this.loggedIn = false;

  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(LOGIN_TOKEN_KEY);

  const tokenExpires = localStorage.getItem(LOGIN_TOKEN_EXPIRES_KEY);

  if (tokenExpires) {
    localStorage.removeItem(LOGIN_TOKEN_EXPIRES_KEY);
  }
  console.log('Emitting loggedOut');
  this.emit('loggedOut');

  return null;
}

export function resumeLogin() {
  const resume = localStorage.getItem(LOGIN_TOKEN_KEY);

  if (!resume) {
    console.log('No Login Token'); //eslint-disable-line no-console
    return this.onLogout();
  }

  return this.login({ resume });
}
