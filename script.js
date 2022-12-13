'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-11-14T23:36:17.929Z',
    '2022-11-15T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-11-15T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
// Display movements

const displayMovements = function (acct, sort = false) {
  containerMovements.innerHTML = '';

  //Implementing Sort 
  const moves = sort ? acct.movements.slice().sort((a, b) => a - b) : acct.movements
  moves.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acct.movementsDates[i]);
    const displayDate = formatMovementDate(date, acct.locale)
    const formattedMov = formatCur(mov, acct.locale, acct.currency)
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
     <div class="movements__date">${displayDate}</div> 
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calDisplayBalance = function (acct) {
  const balance = acct.movements.reduce(function (acc, mov) {
    return acc += mov
  }, 0);
  //Formatting currency

  //Adding balance to the object
  acct.balance = balance

  labelBalance.textContent = formatCur(acct.balance, acct.locale, acct.currency)
}
// calDisplayBalance(account1.movements)


//Display dates function
const formatMovementDate = function (date, locale) {

  const calDaysPassed = (date1, data2) => Math.abs(data2 - date1) / (1000 * 60 * 60 * 24)
  const daysPassed = Math.round(calDaysPassed(new Date(), date));
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const displayDate = `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date)
  }

}

const calDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov)
    .reduce((accumm, mov) => accumm += mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .map(mov => mov)
    .reduce((accumm, mov) => accumm += mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, curr) => int > 1)
    .reduce((accm, curr) => accm + curr, 0)
  labelSumInterest.textContent = formatCur(incomes, acc.locale, acc.currency);
}

// calDisplaySummary(account1.movements)



const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user.slice(0, 1)).join('');
  });
};
creatUserNames(accounts)

//Update the UI
const updateUI = function (acc) {
  //Display the movements
  displayMovements(acc);

  //Display the balance
  calDisplayBalance(acc);

  //Display the summary
  calDisplaySummary(acc);
}



const startLogOutTimer = function(){

  const tick = function(){

    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
   labelTimer.textContent = `${min} : ${sec}`;

   if(time === 0){
    clearInterval(timer);
    labelWelcome.textContent = (`Login to get started`)
    containerApp.style.opacity = 0;
   }
      //Decrease is 
      time --;
  }
  //Set timer for 5 min
  let time =30;
  //Call timer every second
  tick();
  const timer =setInterval(tick,1000)

  //In each call print the reamaining time to the UI

  //When 0 seconds, stop timer and logout the user
  return timer;
}


//Event handler
let currentAccount;
let timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {

    //Display UI and Welcome Message
    labelWelcome.textContent = (`Welcome back, ${currentAccount.owner.split(' ')[0]}`)
    containerApp.style.opacity = 100;

    //Display Current date
    const now = new Date();
    const options = {
      'hour': 'numeric',
      'minute': 'numeric',
      'day': 'numeric',
      'month': 'numeric',
      'year': 'numeric',
      // 'weekday': 'long'
      // 'hour': 'numeric',
      // 'minute': 'numeric',
      // 'day': 'numeric',
      // 'month': 'long',
      // 'year': 'numeric',
      // 'weekday': 'long'
    }
    const currentLocal = currentAccount.locale;
    // labelDate.textContent = new Intl.DateTimeFormat('ar-SY').format(now)
    labelDate.textContent = new Intl.DateTimeFormat(currentLocal, options).format(now)
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const minute = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;


    //Clear input fields
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();

    //Timer
    if(timer) clearInterval(timer)
    timer = startLogOutTimer();
    //Update UI
    updateUI(currentAccount)
  }
});

//Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amountRequested = +inputLoanAmount.value;
  if (amountRequested > 0 &&
    currentAccount.movements.some(dep => dep >= amountRequested * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amountRequested)
      //Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString())
      //Update UI
      updateUI(currentAccount)
      
    //Reset timer
    clearInterval(timer)
    //Start Timer
    timer = startLogOutTimer();
    }, 5000)
  }
  inputLoanAmount.value = '';

});


//Transffer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  //Find the account
  const recieverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  const transAmount = Number(inputTransferAmount.value);
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  if (transAmount > 0
    && recieverAccount
    && currentAccount.balance >= transAmount
    && recieverAccount.username !== currentAccount.username) {
    // console.log(transAmount,recieverAccount);
    //Doing the transfer
    currentAccount.movements.push(-transAmount)
    recieverAccount.movements.push(transAmount)

    //Add Transffer Date
    currentAccount.movementsDates.push(new Date().toISOString())
    recieverAccount.movementsDates.push(new Date().toISOString())
    //Update UI
    updateUI(currentAccount)

    //Reset timer
    clearInterval(timer)
    //Start Timer
    timer = startLogOutTimer();
    
  }
});


//Close the account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const usernameClose = inputCloseUsername.value;
  const pinClose = inputClosePin.value;
  if (currentAccount.username === usernameClose
    && currentAccount.pin === Number(pinClose)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    //console.log(accounts)
    // console.log(index)

    //Delete account
    accounts.splice(index, 1)

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted
})


labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i, arr) {
    if (i % 2 === 0) {
      row.style.backgroundColor = '#FFFBC1'
    }
    if (i % 3 === 0) {
      row.style.backgroundColor = '#59C1BD'
    }
  })
})


const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping:false
  // style:'unit',
  // unit:'mile-per-hour'
}
// const num = 3884764.23;
// console.log('US : ', new Intl.NumberFormat('en-US', options).format(num))
// console.log('Germany : ', new Intl.NumberFormat('de-DE', options).format(num))
// console.log('Syria : ', new Intl.NumberFormat('ar-SY', options).format(num))
// console.log('Kenya : ', new Intl.NumberFormat('sw-KE', options).format(num))
// console.log(navigator.language, new Intl.NumberFormat(navigator.language, options).format(num))



//SetInterval
// let counter = 0;
// setInterval(function(){
//   const now = new Date();
//   console.log(`Current counter is at ${++counter}`)
//   // console.log(now)
// },1000)

//SetTimeout

// setTimeout(()=>
//   console.log('Here is your Book !'),2000)
// console.log('Wating ......')
// setTimeout(function(book1,book2){
//   console.log(`Here are your books ${book1} and ${book2}`)
// },3000, 'Think Big','The River Between')
// console.log('Wating ......')

// const ingredients = ['spinach','egg','olive']

// const pizzaIngredients = setTimeout(function(ingr1,ingr2,ingr3){
//   console.log(`Here is you pizza with ${ingr1}, ${ingr2} and ${ingr3}`)
// },3000, ...ingredients)
// console.log('Waiting for Pizza ......')
// if(ingredients.includes('eg')) clearTimeout(pizzaIngredients)

//FAKE ALWAYS LOGGED IN
// currentAccount = account1
// updateUI(currentAccount)
// containerApp.style.opacity = 100;

// const now = new Date();
// const options = {
//   'hour': 'numeric',
//   'minute': 'numeric',
//   'day': 'numeric',
//   'month': 'long',
//   'year': 'numeric',
//   'weekday': 'long'
// }
// labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now)
// labelDate.textContent = new Intl.DateTimeFormat('ar-SY').format(now)
// const now = new Date();
// const day = `${now.getDate()}`.padStart(2,0);
// const month = `${now.getMonth()+1}`.padStart(2,0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const minute = now.getMinutes();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

// day/month/year



//Creating Arrays 

// console.log([1,2,3,4,5,6,7,8])
// console.log(new Array(1,2,3,4,5,6,7,8))

// const x = new Array(7);
// x.fill(1)
// x.fill(3,2,4);
// console.log(x)

// const y = Array.from({length:7},(current,index)=> 2)
// const Z = Array.from({length:7},(current,index)=> index+1)
// // const y = Array.from({length:7}, function(current,index){
// //   return 2
// // })
// console.log(y,Z)



// labelBalance.addEventListener('click',function(){
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
//   console.log(movementsUI.map(function(ele){
//   return Number(ele.textContent.replace('€',''))
//   })
//     )


//   const movementsUI2 = [... document.querySelectorAll('.movements__value')];
//   console.log(movementsUI2.map(el=>Number(el.textContent.replace('€',''))))
// })
//Separate Callbacks 

// const deposit = function(mv){
//  return mv> 0
// }
// console.log(movements.some(deposit))
// console.log(movements.map(deposit))
// console.log(movements.filter(deposit))

//EVERY
// const everyValue = account4.movements.every(eve=> eve > 0);
// const everyValue1 = movements.every(eve=> eve > 0);
// console.log(everyValue,everyValue1)

// console.log(movements)

// //CHECK CONDITION
// const anyDeposits =movements.some(mov=> mov> 50000);
// const anyDeposits1 =movements.some(mov=> mov> 0);
// const anyDeposits2 =movements.some(mov=> mov ===- 130);

// //CHECK EQUALITY
// console.log(movements.includes(-130))
// console.log(anyDeposits,anyDeposits1);

//PIPELINE
// const euroToUSD = 1.1;
// const totalDeposit =movements
// .filter(mov=>mov>0)
// .map(mov=> mov*euroToUSD)
// .reduce((accumm,mov)=> accumm+=mov,0);

// console.log(totalDeposit)


// console.log(calPrintBalance)

// const creatUserNames = function (passedname) {
//   const username = fullname.toLowerCase().split(' ');
//   // const newuser = username.map(user=>user.slice(0,1))
//   const newuser = username.map(function (user) {
//     return user.slice(0, 1)
//   }).join('');
//   console.log(newuser)
// }
// const fullname = 'Steven Thomas Williams';
// creatUserNames(fullname)

/////////////////////////////////////////////////

// const displayMovements = function (movs) {
//   containerMovements.innerHTML = '';

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__value">${mov}€</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

//   // Display movements
//   displayMovements(account1.movements);


//   const euroToUSD = 1.1;
// const movementsToUSD =movements.map(function(mov){
//   return mov*euroToUSD;
//  });

//  console.log(movements)
//  console.log(movementsToUSD)

//  const movementsToUSDFor =[];
//  for(const mov of movements){
//    movementsToUSDFor.push(mov*euroToUSD)
//    console.log(movementsToUSDFor)
//  }

//  const movementsToUSD2 =movements.map(mov=> mov*euroToUSD);

//  const displayMovements1 =movements.map(function(mov,i,arr){
//   if (mov > 0) {
//    return`Movement ${i + 1}: You deposited ${mov}`;
//   } else {
//     return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
//   }
//  }) 

//  console.log(displayMovements1)


// const deposits =movements.filter(function(mov){
//    return mov>0
// });

// const withdrawals =movements.filter(function(mov){
//   return mov<0
// });
// const deposit =movements.filter(function(mov){
//   if(mov > 0){
//     console.log(`You deposited ${mov}`)
//   } else{
//     console.log(`You withdrew ${mov}`)
//   }
// });

// const depositsfor = [];
// for(const mov of movements){
//   if(mov>0){
//     depositsfor.push(mov)
//   }
// }

// console.log(deposits)
// console.log(depositsfor)
// console.log(withdrawals)


// const balance =movements.reduce(function(accumulator,current,index,array){
//   console.log(`Iteration ${index} accumulator is ${accumulator}`)
//   return accumulator+current;
// },0);


// const balance =movements.reduce((accumulator,current)=>
//   accumulator+current
// ,0);
// console.log(balance)

// let balance2 = 0;
// for(const mov of movements){
//   balance2= balance2+mov
//   console.log(balance2)

// }

// console.log(movements)
// //Checking maximum value
// const checkMaxVal = movements.reduce(function(accumulator,currentValue){
//       if(accumulator>currentValue){
//        return accumulator
//       } else{
//         return currentValue
//       }
//   },movements[0]);
// console.log(checkMaxVal)

// //Checking maximum value
// const checkMinVal = movements.reduce(function(accumulator,currentValue){
//   if(accumulator>currentValue){
//    return currentValue
//   } else{
//     return accumulator
//   }
// },movements[0]);
// console.log(checkMinVal)

// Coding Challenge #2

/*
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function(ages){
//   const newDogAges= ages.map(function(age){
//     if(age<=2){
//       return (age*2)
//     } else{
//       return (16 +(age*4))
//     }
//    });
//    const above18Years = newDogAges.filter(function(ag){
//       if(ag>18){
//         return ag;
//       }
//    });
//    const avr = above18Years.reduce(function(accm,curr){
//        return  accm+=curr
//    },0)/above18Years.length


//    console.log(above18Years)
//    console.log(avr)


// };

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// calcAverageHumanAge(data1)

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function(ages){
//  const humanAge= ages.map(age =>age <= 2 ? age * 2 : 16 +age * 4);
//   const adult= humanAge.filter(hmag=> hmag >= 18);
//   const average = adult.reduce((accum, curre)=> accum+=curre,0)/5;
//   return average
// };

// const avg1 = calcAverageHumanAge(data1);
// const avg2 = calcAverageHumanAge(data2);
// console.log(avg1, avg2);

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// // adults.length

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);


//PIPELINE
// const euroToUSD = 1.1;
// const totalDeposit =movements
// .filter(mov=>mov>0)
// .map(mov=> mov*euroToUSD)
// .reduce((accumm,mov)=> accumm+=mov,0);

// console.log(totalDeposit)




// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages=>{
//  const average= ages
//  .map(age=>age <= 2 ? 2*2 :  16 + age * 4)
//  .filter(age=> age >= 18)
//  .reduce((acumm,curr,i,arr)=> acumm+=curr/arr.length,0);
// return average
// }
// const aveg1 =calcAverageHumanAge(data1)
// const aveg2 =calcAverageHumanAge(data2)
// console.log(aveg1,aveg2);



// const firstWithdrawal = function(movements){
//   const fw = movements.find(function(mov){
//     return mov <0;
//   });
//   console.log(fw)
// }
// firstWithdrawal(movements)

// const firstWithdrawal = (movements)=>{
//   const fw = movements.find(mov=> mov < 0);
//   console.log(fw)
// }
// firstWithdrawal(movements)

// console.log(accounts)

// const account = accounts.find(acc=>acc.owner ='Sarah Smith');
// console.log(account);

// let acct = [];
// for(let acc of accounts){
//   console.log(acc)
//   if(acc.owner = 'Steven Thomas Williams'){
//     acct.push(acc)
//   }
// }

// console.log(acct)

// Joining Array  
// const arr = [[1,2,3],[4,5,6],7,8]
// console.log(arr.flat())

// const arrDeep = [[[1,2],3],[4,[5,6]],7,8]
// console.log(arrDeep.flat(2))


//Flat
// const accountMovements = accounts.map(acc=>acc.movements);
// const allAccounts = accountMovements.flat();
// console.log(allAccounts)
// const overallBalance = allAccounts.reduce((acc,curr)=>acc+=curr,0);
// console.log(overallBalance)

// const chained =accounts
// .map(acc=>acc.movements)
// .flat()
// .reduce((acc,curr)=>acc+=curr,0);
// console.log(chained)

// //Flat map
// const flatMapchained =accounts
// .flatMap(acc=>acc.movements)
// .reduce((acc,curr)=>acc+=curr,0);
// console.log(flatMapchained)


//Sort
//String
// const owners = ['Jonas','Zach','Adam','Martha'];
// console.log(owners.sort());

//Numbers
// ASCENDING
// movements.sort((a,b)=>{
//   if (a>b){
//     return 1;
//   }
//   if(a<b){
//     return -1
//   }
//  })

//  // DESCENDING
// movements.sort((a,b)=>{
//   if (a<b){
//     return 1;
//   }
//   if(a>b){
//     return -1
//   }
//  })
//  movements.sort(function(a,b){
//   if (a>b){
//     return 1;
//   }
//   if(b>a){
//     return -1
//   }
//  })

//  console.log(movements)



// // 1. ALL DEPOSITS SUM
//  const bankDepositSum = accounts.map(mov=>mov.movements)
//  .flat()
//  .filter(mov=>mov>0)
//  .reduce((sum,current)=>sum+=current,0);

//  console.log(bankDepositSum);

// 2. ALL  DEPOSITS ABOVE 1000

// const bankDepositAtleast1000 = accounts
// .map(mov=> mov.movements)
// .flat()
// .filter(mov=> mov>=1000).length;
// console.log(bankDepositAtleast1000);



// const bankDepositAtleast1000 = accounts
// .flatMap(mov=> mov.movements)
// .reduce((count,current)=> current >= 1000 ? count + 1 : count,0);
// console.log(bankDepositAtleast1000);

// 3. 
// const sums = accounts.flatMap(function(mov){
//   return mov.movements
// }).reduce(function(sum,curre){
//   return sum+=curre
// },0);

// console.log(sums);


// 3.   Dposits and Withdrawals
// const sums = accounts.flatMap(function(mov){
//   return mov.movements
// }).reduce(function(sum,curre){
//   curre>0?sum.deposits+=curre:sum.withdrawals+=curre
//   return sum
// },{deposits:0, withdrawals:0});

// console.log(sums);

// const sums = accounts.flatMap(mov=> mov.movements)
// .reduce((sum,curre)=>{
//   curre>0?sum.deposits+=curre:sum.withdrawals+=curre
//   return sum
// },{deposits:0, withdrawals:0});

// console.log(sums);

// const {deposits,withdrawals} = accounts.flatMap(mov=> mov.movements)
// .reduce((sum,curre)=>{
//   curre>0?sum.deposits+=curre:sum.withdrawals+=curre
//   return sum
// },{deposits:0, withdrawals:0});

// console.log(deposits,withdrawals);


// 4 . this is a nice title = >This Is a nice Title?
// const convertTitleCase = function(title){
//   const exceptions = ['a' , 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title.toLowerCase().split(' ')
//   .map(function(word){
//     return exceptions.includes(word)? word : word[0].toUpperCase()+ word.slice(1);
//   });
//   return titleCase
// }

// const convertTitleCase = function(title){
//   const exceptions = ['a' , 'an', 'the', 'but', 'or', 'on', 'in', 'with','and'];
//   const titleCase = title.toLowerCase().split(' ')
//   .map(word=> exceptions.includes(word)? word : word[0].toUpperCase()+ word.slice(1)).join(' ');
//   return titleCase
// }

// console.log(convertTitleCase('this is a nice title'))
// console.log(convertTitleCase('this is a LONG title but not too long'))
// console.log(convertTitleCase('and here is another title with an EXAMPLE'))


///////////////////////////////////////
// Coding Challenge #4

/*
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion
 and add it to the object as a new property. Do NOT create a new array, simply loop over the array.
 Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little.
HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array,
and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners
 of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!"
and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order
 (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

*/

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];
// const calculatedFood = function(dogs){
//     const dogsWeight = dogs.map(function(dgs){

//       const recommendedFood = Math.round(dgs.weight ** 0.75 * 28);
//      return dgs.food = recommendedFood;
//     })
//     return dogsWeight;
// }
// calculatedFood(dogs)


// const findSarahDogs = dogs.

// 1. 
// dogs.forEach(function(dog){
//   dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)
// })
// console.log(dogs)

//2
// const dogSarah = dogs.find(function(dog){
//   console.log(dog.owners)
//   return dog.owners.includes('Sarah')
// })
// const dogSarah = dogs.find(dog=>dog.owners.includes('Sarah'))
// console.log(dogSarah)
// console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'}`)

//3
// const ownersEatTooMuch = dogs.filter(function(dog){
//   return dog.curFood > dog.recFood
// }).map(function(dog){
//   return dog.owners
// }).flat();

// const ownersEatTooMuch = dogs
// .filter(dog=> dog.curFood > dog.recFood)
// .map(dog=> dog.owners)
// .flat();
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
// .filter(dog=> dog.curFood < dog.recFood)
// .map(dog=> dog.owners)
// .flat();
// console.log(ownersEatTooLittle);


// 4

// "Matilda and Alice and Bob's dogs eat too much!" 
// "Sarah and John and Michael's dogs eat too little!"
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`)
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`)


//5
// console.log(dogs.some(function(dog){
//   return dog.recFood === dog.curFood;
// }))
// console.log(dogs.some(dog=>dog.recFood === dog.curFood))


//6
// current > (recommended * 0.90) && current < (recommended * 1.10)


// console.log(dogs.some(dog=> dog.curFood > dog.recFood*0.90 && dog.curFood < dog.recFood*1.10))
// const checkEatingOkey = dog=> dog.curFood > dog.recFood*0.90 && dog.curFood < dog.recFood*1.10
// console.log(dogs.some(checkEatingOkey))
// console.log(dogs.some(function(dog){
//   return dog.curFood > dog.recFood*0.90 && dog.curFood < dog.recFood*1.10;
// }))

//7
// console.log(dogs.filter(checkEatingOkey))

//8
// sort it by recommended food portion in an ascending order

// const dogsCopy = dogs.slice().sort((a,b)=>a.curFood - b.curFood);
// console.log(dogsCopy)


//Check if its even number
// const isEven = n => n%2 === 0
// console.log(isEven(4))
// const rows = [...document.querySelectorAll('.movements__row')];

// rows.forEach(function(row){
//  row.style.backgroundColor ='orangered'
// })




// const bankaccount2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

//   movementsDates: [
//     '2019-11-01T13:15:33.035Z',
//     '2019-11-30T09:48:16.867Z',
//     '2019-12-25T06:04:23.907Z',
//     '2020-01-25T14:18:46.235Z',
//     '2020-02-05T16:33:06.386Z',
//     '2020-04-10T14:43:26.374Z',
//     '2020-06-25T18:49:59.371Z',
//     '2020-07-26T12:01:20.894Z',
//   ],
//   currency: 'USD',
//   locale: 'en-US',
// };

/*
console.log(2**53 -1)

console.log(Number.MAX_SAFE_INTEGER)

console.log(2**53 +2)

const now = new Date();
console.log(now)
console.log(bankaccount2.movementsDates[0])
*/

// const future = new Date(2037,10,12,31,50,55)
// console.log(future)
// console.log(future.getFullYear())
// console.log(future.getMonth())
// console.log(future.getDate())
// console.log(future.getDay())
// console.log(future.getHours())
// console.log(future.getMinutes())
// console.log(future.getSeconds())
// console.log(future.toISOString())
// console.log(future.toDateString())
// console.log(future.getTime())
// console.log(new Date(2141700655000))

// //Timestamp for now

// console.log(Date.now())


// const calDaysPassed = (date1, data2)=> Math.abs(data2-date1)/(1000*60*60*24)
// const day1 = calDaysPassed(new Date(2024,10,20) ,new Date(2024,10,5))
// console.log(day1);

// const arr = [1,2,3,4,5]
// const k =4

// const findNumber = function(arr,k){
//  return arr.includes(k)
// }


// console.log(findNumber(arr,k) ? 'YES': 'NO');


// let answer = 0;
// let balance = 0;

// for (let i = 0; i < s.length; ++i) {

//   balance += s[i] == '(' ? 1 : -1;

//     if (balance == -1) {
//       answer += 1;
//       balance += 1;
//     }
// }

// return balance + answer;

// const num = 15;
// const checkNumber = function (n){
//   for (let i = 1; i <= n; i++) {

//     if(i%3 === 0 && i%5 ===0){
//       // return (`FizzBuzz`)
//       console.log(`FizzBuzz`)
//     } else if (i%3 === 0){
//       console.log(`Fizz`)
//     }else if (i%5 === 0){
//       console.log(`Buzz`)
//     }else {
//       console.log(`${i}`)
//     }
//   }
// }
// checkNumber(num)



//  function minParentheses(s)
// {
 
//     let answer = 0;
//     let balance = 0;
 
//     for (let i = 0; i < s.length; ++i) {
 
//       balance += s[i] == '(' ? 1 : -1;
 
//         if (balance == -1) {
//           answer += 1;
//           balance += 1;
//         }
//     }
 
//     return balance + answer;
// }
 
// const s = "())))";
 
// console.log( minParentheses(s))

// function arePermutation(str1, str2)
// {
     
//     // Get lengths of both strings
//     let n1 = str1.length;
//     let n2 = str2.length;
 
//     // If length of both strings is not same,
//     // then they cannot be Permutation
//     if (n1 != n2)
//         return false;
         
//     let ch1 = str1.split(' ');
//     let ch2 = str2.split(' ');
 
//     // Sort both strings
//     ch1.sort();
//     ch2.sort();
 
//     // Compare sorted strings
//     for(let i = 0; i < n1; i++)
//         if (ch1[i] != ch2[i])
//             return false;
 
//     return true;
// }
 

