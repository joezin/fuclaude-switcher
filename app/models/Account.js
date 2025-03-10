// Account model
class Account {
  constructor(id, name, email, sessionKey, isActive = true) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.sessionKey = sessionKey;
    this.isActive = isActive;
  }
}

export default Account; 