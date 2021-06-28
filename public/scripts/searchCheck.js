const userInput = document.querySelector('#userInput')

userInput.addEventListener('change', () => {
  const userInputValue = userInput.value.trim()
  !userInputValue
    ? userInput.setCustomValidity('At least one character.')
    : userInput.setCustomValidity('')
})
