const itemForm = document.querySelector('#item-form')
const itemInput = document.querySelector('#item-input')
const filter = document.querySelector('#filter')
const itemList = document.querySelector('#item-list') // ul element
const mainBtn = document.querySelector('#main-btn')
const clearBtn = document.querySelector('#clear-all')

let isEditMode = false

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

const displayItems = () => {
    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.forEach(item => addItemToDOM(item))
    checkUI()
}

const onItemClick = (e) => {
    if (e.target.parentElement.classList.contains('delete-btn')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target)
    }
}
const clearItems = () => {
    if (itemList.firstChild) {
        if (confirm('Do you want to delete all items?')) {
            while (itemList.firstChild) {
                itemList.removeChild(itemList.firstChild)
            }
        } else {
            alert('You Cancel the process!')
        }
    }
    //Clear from localStorage
    localStorage.removeItem('items')
    checkUI()

}
const onAddItemSubmit = (event) => {
    let itemsFromStorage = getItemsFromStorage()
    event.preventDefault()
    const newItem = itemInput.value
    if (checkIfItemExists(newItem)) {
        alert('That item already exists.')
        return
    }
    // Validate Input
    if (newItem.trim() === '') {
        alert('Please add an item')
        return;
    } else {
        //Create item DOM element
        if (!isEditMode) {
            addItemToDOM(newItem)
            //Add items to localStorage
            addItemToStorage(newItem)
        }
    }
    //Check for editMode 
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode')
        const index = itemsFromStorage.findIndex((item) => item.toLowerCase() === itemToEdit.textContent.toLowerCase())
        itemsFromStorage[index] = newItem
        itemToEdit.classList.remove('edit-mode')
        localStorage.removeItem('items')
        localStorage.setItem('items', JSON.stringify(itemsFromStorage))
        itemList.innerHTML = ''
        itemsFromStorage.forEach(item => addItemToDOM(item)
        )
        isEditMode = false
        checkUI()
    }



    checkUI()
    itemInput.value = ''
}

function addItemToDOM(item) {
    const li = document.createElement('li')
    li.className = 'list-item'
    const text = document.createTextNode(item.trim())
    const button = createButton('delete-btn')
    const icon = createIcon('fa fa-x fa-solid')
    button.appendChild(icon)
    li.appendChild(text)
    li.appendChild(button)

    itemList.append(li);
}

function setItemToEdit(item) {
    isEditMode = true;
    const items = document.querySelectorAll('li')
    if (item.classList.contains('list-item-container') || item.classList.contains('fa') || item.classList.contains('delete-btn')) {
        itemInput.value = ''
        return isEditMode = false
    }
    console.log(item)
    items.forEach((item) => {
        item.classList.remove('edit-mode')
    }
    )
    console.log(item)
    item.classList.add('edit-mode')
    mainBtn.innerHTML = `<i class='fa fa-pen-to-square'></i> Update Item`
    mainBtn.className = 'update-btn'
    itemInput.value = item.textContent


}

function addItemToStorage(itemName) {
    const itemsFromStorage = getItemsFromStorage()

    //Add new item to array
    itemsFromStorage.push(itemName)

    //convert to json string and set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
    console.log(itemsFromStorage)

}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage()

    itemsFromStorage = itemsFromStorage.filter((storeItem) => storeItem !== item)

    //reset localStorage with new Array 
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}

function removeItem(item) {
    const text = item.textContent
    if (confirm(`Are you sure to delete "${text}"?`)) {
        //remove item from dom
        item.remove()
        //remove item from localStorage
        removeItemFromStorage(text)
        checkUI()
    }

}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
}

const filterItem = (e) => {
    const text = e.target.value.toLowerCase()
    const items = itemList.querySelectorAll('li')
    items.forEach((item) => {
        if (item.textContent.toLowerCase().indexOf(text) !== -1) {
            item.style.display = 'flex'
        } else {
            item.style.display = 'none'

        }
    })
}

const checkUI = () => {
    const footer = document.querySelector('footer')
    const filterContainer = document.querySelector('.filter-container')
    itemInput.value = ''

    const items = document.querySelectorAll('li')
    if (items.length === 0) {
        footer.style.display = 'none'
        filterContainer.style.display = 'none'
    } else {
        footer.style.display = 'flex'
        filterContainer.style.display = 'flex'
    }
    mainBtn.className = 'add-btn'
    mainBtn.innerHTML = `<i class='fa fa-plus'></i> Add Item`
    isEditMode = false

}

//Initialize app
function init() {
    // event listeners
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onItemClick)
    clearBtn.addEventListener('click', clearItems)
    filter.addEventListener('input', filterItem)
    document.addEventListener('DOMContentLoaded', displayItems)
    //Check ui while windows load
    checkUI()
}

init()