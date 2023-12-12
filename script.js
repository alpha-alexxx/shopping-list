const itemForm = document.querySelector('#item-form')
const itemInput = document.querySelector('#item-input')
const itemList = document.querySelector('#item-list')

const addItem = (event) => {
    event.preventDefault()
    const newItem = itemInput.value
    // Validate Input
    if (newItem === '') {
        alert('Please add an item')
        return;
    }
    //create list item 
    const li = document.createElement('li')
    const span = document.createElement('span')
    const spanTxt = document.createTextNode(newItem.trim())
    span.appendChild(spanTxt)
    const button = createButton('delete')
    const icon = createIcon('fa fa-x fa-solid')

    button.appendChild(icon)
    li.appendChild(span)
    li.appendChild(button)

    itemList.append(li);
    itemInput.value = ''

}

const createButton = (classes) => {
    const button = document.createElement('button')
    button.className = classes
    return button
}

const createIcon = (classes) => {
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}
// event listeners
itemForm.addEventListener('submit', addItem)

