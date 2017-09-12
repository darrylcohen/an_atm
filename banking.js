
var Account = function(name, balance) {
  this.name = name,
  this.balance = balance,
  this.deposit = function(amount) {
    this.balance += amount;
  },
  this.withdraw = function(amount) {
    this.balance -= amount;
  },
  this.canWithdraw = function(amount) {
    return this.balance < amount ? false : true
  }
}

var view = {
  depositBTN : document.getElementById('deposit'),
  withdrawBTN : document.getElementById('withdraw'),
  // balanceBTN : document.getElementById('balance'),
  exitBTN : document.getElementById('exit'),
  addBTN : document.getElementById('add'),
  deleteBTN : document.getElementById('delete'),
  amountTXT : document.getElementById('amount'),
  accountInfo : document.getElementById('accountInfo'),
  accountsCMB : document.getElementById('accountsCombo'),
  cmb : document.createElement('select'),
  container :  document.getElementById('container'),

  exit : function () {
    // container.style.backgroundColor = "black";
    document.body.removeChild(view.container)
    document.body.className = 'done'
    document.getElementById('bye').style.display = 'block'

  },
  bankrupt : function () {
    alert("You're bankrupt. Deposit more money");
  },
  changingAccount : function (account) {
    alert('You dont have money is this account. The money is coming from your ' + account.name + ' account')
  },
  getAccountName : function () {
    return prompt('Enter account name')
  },
}

var data  = {
  accountNames : ['Cheque', 'Savings'],
  allAccounts : [],
  selectedAccount : Account,
  amount : 0,
}


var controller = {
  createAccounts :  function() {
    var account;
    data.allAccounts = data.accountNames.map(function(accountName) {
      var x = new Account(accountName,0);
      return x;
    })
    return data.allAccounts
  },
  checkOtherAccounts : function(accounts,account,amount) {
    var result = -1;
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].canWithdraw(amount)) {
        result = accounts[i];
        break;
      }
    }
    return result;
  },
  deposit : function(amount) {
    var account = data.selectedAccount
    account.deposit(amount);
    controller.displayAccountInfo(data.allAccounts);
  },
  withdraw : function(amount) {
    var account = data.selectedAccount
    if (account.canWithdraw(amount)) {
      account.withdraw(amount);
      controller.displayAccountInfo(data.allAccounts)
    } else {
      var newAccount = controller.checkOtherAccounts(data.allAccounts, account,amount);
      if (newAccount !== -1) {
        newAccount.withdraw(amount)
        controller.displayAccountInfo(data.allAccounts);
        view.changingAccount(newAccount);
      } else {
        view.bankrupt();
      }
    }
  },
  add : function() {
    var name = view.getAccountName();
    var account = new Account(name,0);
    data.allAccounts.push(account);
    var option = document.createElement('option');
    option.vaule = account.name;
    option.text = account.name;

    view.cmb.appendChild(option);
    controller.displayAccountInfo(data.allAccounts);
  },

  delete : function() {
    var account = data.selectedAccount;
    var accounts = data.allAccounts;
    accounts.splice(accounts.indexOf(account),1)
    while (view.cmb.firstChild) {
    		view.cmb.removeChild(view.cmb.firstChild);
  	}
    controller.buildAccontsCombo(accounts);
    controller.displayAccountInfo(accounts);

  },
  addListeners : function() {
    view.depositBTN.addEventListener('click', function() {
      data.amount = parseInt(view.amountTXT.value);
      controller.deposit(data.amount);
    });
    view.withdrawBTN.addEventListener('click', function() {
      data.amount = parseInt(view.amountTXT.value);
      controller.withdraw(data.amount);
    });
    // view.balanceBTN.addEventListener('click', function() {
    //   controller.getBalance();
    // })
    view.exitBTN.addEventListener('click', function() {
      view.exit();
    })
    view.addBTN.addEventListener('click', function() {
      controller.add();
    })
    view.deleteBTN.addEventListener('click', function() {
      controller.delete();
    })
  },
  buildAccontsCombo : function (accounts) {
    accounts.forEach(function(account) {
      var option = document.createElement('option');
      option.value = account.name;
      option.text = account.name;
      view.cmb.appendChild(option);
    })
    view.accountsCMB.appendChild(view.cmb);
    view.cmb.className = 'options'
    view.cmb.id = 'cmb';
    view.cmb .addEventListener( "change", function() {

    data.selectedAccount = accounts[this.selectedIndex]
    view.cmb.value = data.selectedAccount.name

    })
  },
  displayAccountInfo : function(accounts) {
    var info = view.accountInfo;
    var output = '<p>';
    // var accounts = data.allAccounts
    for (var i = 0; i < accounts.length; i++) {
      output += 'Account : ' + accounts[i].name + ' -  Balance : ' + accounts[i].balance  + '<br>'
    }
    output += '</p>'
    info.innerHTML = output;
  },
  setData : function(accounts) {
    controller.buildAccontsCombo(accounts);
    controller.displayAccountInfo(accounts);
  }
}

var bankingBeginning = function() {
  var accounts = controller.createAccounts();
  data.selectedAccount = accounts[0]
  controller.addListeners();
  controller.setData(accounts);

}

var start = function() {
  bankingBeginning()

}
start();
