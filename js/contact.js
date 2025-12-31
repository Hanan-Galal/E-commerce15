//select elelments
const form=document.getElementById('contact-form');
const successMessage=document.createElement('p');

//event 
form.addEventListener('submit', handleSubmit);


//main handler function
function handleSubmit(event){
    event.preventDefault();               
    clearErrors();                        
    removeSuccessMessage();
    const data=collectFormData();          

    if (!validateFormData(data)) return;      

    sendForm(data);                    
    showSuccessMessage();                   
    form.reset();                           
}

//Collect Data
function collectFormData(){
    return({
        fristName: form['frist-name'].value.trim(),
        lastName: form['Last-name'].value.trim(),
        email: form['email'].value.trim(),
        message: form['message'].value.trim()
    });
}
//validate data
function validateFormData(data){
    let isValid=true;
    //validate first name
    if(isEmpty(data.fristName)){
        isValid=false;
        showError('frist-name','First name is required');
    }
    else if(data.fristName.length<3 || data.fristName.length>15){
        isValid=false;
        showError('frist-name','First name must be between 3 and 15 characters');
    }
    //validate last name
    if(isEmpty(data.lastName)){
        isValid=false;
        showError('Last-name','Last name is required');
    }
    else if(data.lastName.length<3 || data.lastName.length>15){
        isValid=false;
        showError('Last-name','Last name must be between 3 and 15 characters');
    }
    //validate email
    if (!isValidEmail(data.email)){
        isValid=false;
        showError('email','Email is required');
    
    }
    //validate message
    if(isEmpty(data.message)){
        isValid=false;
        showError('message','Message is required');
    }
    else if(data.message.length<10 || data.message.length>300){
        isValid=false;
        showError('message','Message must be between 10 and 300 characters');
    }
    return isValid;
}
// show success message
function showSuccessMessage(message) {
  successMessage.textContent = "Message sent successfully";
  successMessage.className =
    "text-green-600 font-medium mt-4 text-center";

  form.appendChild(successMessage);
}
//remove success message
function removeSuccessMessage() {
  if (form.contains(successMessage)) {
    form.removeChild(successMessage);
  }}


//show error
function showError(fieldId,message){
    const input=form[fieldId];
    const errorSpan=input.nextElementSibling;
    errorSpan.textContent=message;
    input.classList.add('border-red-500');
}
//clear errors
function clearErrors() {
  const errors = form.querySelectorAll(".error");

  errors.forEach((error) => (error.textContent = ""));

  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => input.classList.remove("border-red-500"));
}


//helper functions
function isEmpty(value){
    return value==='';
}
function isValidEmail(email){
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function sendForm(data) {
  console.log("Sending data:", data);
}