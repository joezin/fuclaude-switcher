// Account model
class Account {
  constructor(id, name, email, sessionKey, prefixUrl, isActive = true) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.sessionKey = sessionKey;
    this.prefixUrl = prefixUrl;
    this.isActive = isActive;
  }
}

export default Account; 