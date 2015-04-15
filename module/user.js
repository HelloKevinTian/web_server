/**
 * Created by King Lee on 2014/7/10.
 */

var user = function() {
    this.username = null;
    this.password = null;
};

module.exports = user;

user.prototype.init = function(username,password){
    this.username = username;
    this.password = password;
};

user.prototype.get_username = function(){
    return this.username;
};
user.prototype.get_password = function(){
  return this.password;
};