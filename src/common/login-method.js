import * as multiStorage from "./multi-storage";

export function onLogin({ id, token }) {
  this.userId = id;
  this.loggedIn = true;
  return multiStorage.set('Meteor.loginToken', token)
    .then(this.emit.bind(this, "loggedIn", id))
    .then(() => id);
}

export function onLogout() {
  this.userId = null;
  this.loggedIn = false;
  return multiStorage.del('Meteor.loginToken')
    .then(this.emit.bind(this, "loggedOut"))
    .then(() => null);
}

export function resumeLogin() {
  return multiStorage.get('Meteor.loginToken')
    .then(resume => {
      if (!resume) {
        throw new Error("No login token");
      }
      return { resume };
    })
    .then(this.login.bind(this))
    .catch(onLogout.bind(this));
}
