pragma solidity ^0.4.4;

contract Managed {
  mapping(address => bool) public authorizedKeys;
  mapping(address => bool) public pendingAuthorizedKeys;

  struct DeauthVote {
        address key;
        address[] nominators;
        uint count;
    }

    function Managed() {
      address owner  = tx.origin;
        authorizedKeys[owner] = true;
    }

    modifier onlyAuthorized() {
        if (isAuthorized(msg.sender)) {
            _;
        } else {
          return;
        }
    }

    function isAuthorized(address key) returns(bool) {
        if (authorizedKeys[key] == true){
          return true;
        }
        else
          return false;
    }

    function revokeAuthorization(address key) onlyAuthorized() returns(bool) {
      if (authorizedKeys[key] == true && key != msg.sender){
          authorizedKeys[key] = false;
          return true;
      }
      else
        return false;
    }

    function addKey(address key) onlyAuthorized() returns(bool) {
      if (authorizedKeys[msg.sender] != true) {
            pendingAuthorizedKeys[msg.sender] = true;
      }

    }

    function claimauthorizedKeyship() returns(bool) {
        if (pendingAuthorizedKeys[msg.sender] != true) {
            return false;
        }
        authorizedKeys[msg.sender] = true;
        pendingAuthorizedKeys[msg.sender] = false;
        return true;
    }


    function forwardCall(address _to, uint _value, bytes _data) onlyAuthorized() returns(bool) {
        if (!_to.call.value(_value)(_data)) {
            throw;
        }
        return true;
    }
}
