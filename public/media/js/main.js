/*
** Contact form
*** not a nicest code but working
**  todo:
** - maybe some refactoring ??
** - better css styles
*/
const contactForm = document.querySelector('#contact');

let yourName = {
    docQ: document.querySelector('#yourName'),
    validated: false,
    err: false,
    div: document.createElement('div'),
    errMsg: 'Name cannot be empty',
    valRule: 'required'
}

let yourEmail = {
    docQ: document.querySelector('#yourEmail'),
    validated: false,
    err: false,
    div: document.createElement('div'),
    errMsg: 'Need valid email',
    valRule: 'email'
}

let yourMsg = {
    docQ: document.querySelector('#yourMsg'),
    validated: false,
    err: false,
    div: document.createElement('div'),
    errMsg: 'Message cannot be empty',
    valRule: 'required'
}


// Name field validation
yourName.docQ.addEventListener('click', function(e) { 
    showDiv(yourName); })

yourName.docQ.addEventListener('input', function(e) { 
    fieldAction(yourName); })

// Mail field validation
yourEmail.docQ.addEventListener('input', function(e) {
    fieldAction(yourEmail); })

yourEmail.docQ.addEventListener('click', function(e) {
    showDiv(yourEmail); })

// comment field validation
yourMsg.docQ.addEventListener('input', function(e) {
    fieldAction(yourMsg); })

yourMsg.docQ.addEventListener('click', function(e) {
    showDiv(yourMsg); })


function showDiv(data) {
    if( data.err === false )
    {
        data.div.classList.add('show-err-msg');
        data.div.append( data.errMsg );
        data.docQ.insertAdjacentElement('afterend', data.div);
        data.err = true;
        data.docQ.classList.add('validation-error');
    }
}

function fieldAction( data ) {

    const value = data.docQ.value;
  
    // make validations
    if(data.valRule === 'required')
    {
        console.log(value);
        if( value.length > 0) {
            data.validated = true;
        } else {
            data.validated = false;
        }
    } 

    if(data.valRule === 'email')
    {
       
        if( validateEmail(value) ) {
            data.validated = true;
        } else {
            data.validated = false;
        }
    } 
    
    // is data is validated ? 
    if( data.validated === true )
    {
        data.docQ.classList.remove('validation-error');
        data.docQ.classList.add('validation-ok');
        data.div.classList.add('valid');
        data.div.innerText = 'All good!';
    } else {
        data.docQ.classList.remove('validation-ok');
        data.docQ.classList.add('validation-error');
        data.div.classList.remove('valid');
        data.div.innerText = data.errMsg;
    }
    return;
}

// 
// is valid email
// function found from stackoverflow
const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


contactForm.addEventListener('submit', function(e) {
    if( !(yourName.validated && yourEmail.validated && yourComment.validated ) ) {
        console.log('nope');
        e.preventDefault();  
        showDiv(yourName); 
        showDiv(yourEmail);
        showDiv(yourMsg);
    } 
});

/** END OF CONTACT FORM HANDLER **/