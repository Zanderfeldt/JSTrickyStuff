function createAccount(pin, amount = 0) {
  return {
    checkBalance(inputPin) {
      if (inputPin !== pin) return "INVALID PIN";
      return `$${amount}`;
    },
    deposit(inputPin, newAmount) {
      if (inputPin !== pin) return "INVALID PIN";
      amount += newAmount;
      return `Successfully deposited ${newAmount}. Current balance: $${amount}`;
    },
    withdraw(inputPin, withdrawalAmount) {
      if (inputPin !== pin) return "INVALID PIN";
      if (withdrawalAmount > amount) return "Withdrawal amount exceeds account balance. Transaction cancelled."
      amount -= withdrawalAmount;
      return `Successfully withdrew ${withdrawalAmount}. Current balance: $${amount}`;
    },
    changePin(inputPin, newPin) {
      if (inputPin !== pin) return "INVALID PIN";
      pin = newPin;
      return "PIN successfully changed!";
    }
  };
}

module.exports = { createAccount };
