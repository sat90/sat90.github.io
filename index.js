const balance = document.getElementById('balance');
const sum = document.getElementById('sum');
const loanBalance =document.getElementById('loanBalance');

let myBalance=0;
let mySalary=0;
let myLoan=0;
let mySum=0;
let computerId=0;

function addListeners() {
    //Get a loan button
    document.getElementById('loanButton')
        .addEventListener('click', function () {
            console.log("test");
            let loanAmount = window.prompt("How much would you like to loan? max: "+myBalance*2)
            if(myLoan===0 && parseInt(loanAmount)<=2*myBalance && parseInt(loanAmount)>0){
                myLoan=parseInt(loanAmount);
                myBalance+=parseInt(loanAmount);
                updateVals()
                toggleLoan(true);
            }
        });
    //Repay loan button
    document.getElementById('repayLoanButton')
        .addEventListener('click', function () {
            myLoan-=mySalary;
            mySalary=0;
            if(myLoan<=0){
                toggleLoan(false);
            }
            updateVals()
        });
    //Bank button
    document.getElementById('bankButton')
        .addEventListener('click', function () {
            if(myLoan>=0){
                myLoan-=mySalary*0.1;
                mySalary*=0.9;
                if(myLoan<0){
                    toggleLoan(false);
                }
            }
            myBalance+=mySalary;
            mySalary=0;
            updateVals()
        });
    //Work button
    document.getElementById('workButton')
        .addEventListener('click', function () {
            document.getElementById('salary');
            mySalary+=100;
            document.getElementById('salary').innerHTML=mySalary;
        });
    //Laptop selector
    document.getElementById('laptopSel')
        .addEventListener('change', function () {
            computerId=this.value;
            updateLaptop();
        });
    //Buy now button
    document.getElementById('buyNow')
        .addEventListener('click', function () {
            if(myBalance>=mySum){
                myBalance-=mySum;
                window.alert('Congratulations! You bought a brand new '+data[computerId].title)
            }else{
                window.alert('Sorry, you can not afford this computer at this time.')
            }
        });
}

//Toggles the get a loan and pay back loan and outstanding loan items depending on situation
function toggleLoan(show){
    if(show){
        document.getElementById('loanParagraph1').hidden=false;
        document.getElementById('loanParagraph2').hidden=false;
        document.getElementById("loanButton").hidden=true;
        document.getElementById("repayLoanButton").hidden=false;
    }else {
        mySalary -= myLoan;
        myLoan = 0;
        document.getElementById('loanParagraph1').hidden = true;
        document.getElementById('loanParagraph2').hidden = true;
        document.getElementById("loanButton").hidden = false;
        document.getElementById("repayLoanButton").hidden = true;
    }
}
//Changes all information regarding laptop on select change
function updateLaptop(){
    const featuresString = data[computerId].specs;
    let htmlString = '';
    for (const s of featuresString) {
        htmlString+=s;
        htmlString+='<br>';
    }
    mySum=data[computerId].price;
    document.getElementById('sum').innerHTML=mySum;
    document.getElementById('features').innerHTML=htmlString;
    document.getElementById('myImg').src='https://noroff-komputer-store-api.herokuapp.com/'+data[computerId].image;
    document.getElementById('myImg').onerror = function(){
        this.src='https://bitsofco.de/content/images/2018/12/broken-1.png';
    }
    document.getElementById('description').innerHTML=data[computerId].description;
    document.getElementById('laptopName').innerHTML=data[computerId].title;
}

function updateVals(){
    document.getElementById('loanBalance').innerHTML=myLoan;
    document.getElementById('salary').innerHTML=mySalary;
    document.getElementById('balance').innerHTML=myBalance;
}


let data = [];

//fetch data
function fetchData() {
    return fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('could not fetch laptop data.')
            }
            return response.json();
        });
}

//Adds options for select from the API
function populate(){
    let sel = document.getElementById('laptopSel');
    for (let i = 0; i < data.length; i++) {
        let opt = document.createElement('option');
        opt.value=i;
        opt.innerHTML=data[i].title;
        sel.appendChild(opt);
    }
    updateLaptop();
}


// @ts-ignore
async function init() {
    try {
        data = await fetchData();
        addListeners();
        populate();
    } catch (error) {
        console.log('Error!', error.message);
    }
}

init();
