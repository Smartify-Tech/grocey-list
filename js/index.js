/***  SELECT ITEMS ***/
const form = document.querySelector('.grocery-form'),
    inputBox = document.getElementById('book-input'),
    submitBtn = document.querySelector('.submit-btn')
    alertMessage = document.querySelector('.alert'),
    bookItem = document.querySelector('.book-item'),
    bookContainer = document.querySelector('.book-container'),
    bookList = document.querySelector('.book-list'),
    clearBtn = document.querySelector('.clear-btn');


/*** EVENT LISTENERS***/
form.addEventListener('submit', showMessage);
clearBtn.addEventListener('click', clearItemsFromHtmlView);
window.addEventListener('DOMContentLoaded', loadFunction)

/** SET FLAGS */
let editFlag = false;
let editElement;
let editId;

/*** FUNCTIONS***/

// iterate the local storage and mapp out all the 
// load function
function loadFunction()
{
    // if number of items is up to one
    if (getLocalStorage().length > 0)
    {
        //show view from localStorage
        updateItemsToView();

        //show list of books
        bookContainer.classList.add('show-container')

    }

}


function showMessage(e)
{
    e.preventDefault();
    const value = inputBox.value.trim(),
        id = new Date().getTime().toString();

    //user inputed something and didn't click the edit
    //clicked submit
    if (value && !editFlag)
    {
        //add item to local storage
        addToLocalStorage(id, value);
        // remove all element from the bookList_innerHtml
        bookList.innerHTML = ''
        // show updated items
        updateItemsToView();
        //show message
        updateAlert('Item added successfully!!', 'success')
        //show list of books
        bookContainer.classList.add('show-container')

    }

    //user inputed something and clicked the edit
    else if (value && editFlag)
    {
        //update local storage
        updateLocalStorage(editId, value);
        //edit the book title to the html view
        editElement.childNodes[0].textContent = value;
        //show message
        updateAlert('Item changed', 'success')
        //setback to default
        setBackDefault();


    }
    //didn't click the edit and nothing inputed
    else
    {
        //show alert
        updateAlert('Oooops!! Empty Value', 'danger');
    }
} // end of showMessage

//loop thru the local storage list item and update the html
function createHtmlListItem(id, value, count)
{

    bookList.innerHTML = `<article 
                                    data-id = ${id}
                                    class="book-item">
                        <p class="book-title">${value}
                                        <span id="book-count">(${count})</span></p>
                        <div class="btn-container">
                            <button class="book-btn edit-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="book-btn delete-btn">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </article>` + bookList.innerHTML;

}

//display alert function
function updateAlert(message, state)
{
    alertMessage.textContent = message;
    alertMessage.classList.add(`alert-${state}`)

    //remove alert
    //setTimout runs the function when the time elapses
    setTimeout(() =>
    {
        alertMessage.textContent = '';
        alertMessage.classList.remove(`alert-${state}`)
    }, 1000);

} //end of alert function

// set back to default
function setBackDefault()
{
    inputBox.value = '';
    editFlag = false;
    editId = '';
    submitBtn.textContent = 'Submit'
} //end

//clear item list from view(html)
function clearItemsFromHtmlView()
{
    let items = document.querySelectorAll('.book-item');
    items.forEach(function (item)
    {
        bookList.removeChild(item)
    })

    //show alert
    updateAlert('Items removed successfully', 'danger')
    //hide list of books and clear button since item is cleared
    bookContainer.classList.remove('show-container')
    setBackDefault();
    //remove the list item from local storage - empty the list
    clearLocalStorage();

} //end

// edit button click
function editItem(e)
{
    editFlag = true;
    submitBtn.textContent = 'Edit';
    editElement = e.currentTarget.parentElement.
        previousElementSibling;
    //set initial title to the input box
    inputBox.value = editElement.childNodes[0].textContent.trim()
    editId = e.currentTarget.parentElement.parentElement
        .dataset.id;
}

//delete function for deleting just one item when item is clicked
function deleteItem(e)
{
    let item = e.currentTarget.parentElement.parentElement;
    let itemInStorage = getItemFromLocalStorage_ById(item.dataset.id);
    //remove or reduce the item from local storage
    removeFromLocalStorage(itemInStorage.id)

    // remove all element from the bookList_innerHtml
    bookList.innerHTML = ''

    //show updated item
    updateItemsToView();

    //if there is no item in html view
    if (bookList.children.length === 0)
        // clear local storage and show appropraite alert
        clearItemsFromHtmlView();
    else
        updateAlert('Item removed', 'danger')
}
/** LOCAL STORAGE */

//get item array from local storage
function getLocalStorage()
{
    //if there is a list of items in local storage
    //then set it to our items else, create new list of items
    return _items = (localStorage.getItem('list'))
        ? JSON.parse(localStorage.getItem('list')) : [];
}
// add or increament just one item to local storage
function addToLocalStorage(id, _value)
{
    let foundDuplicate = false
    //one item
    let newItem = { id: id, value: _value, count: 1 }

    //get item array
    let _items = getLocalStorage();
    //loop thru the items and look for duplicate value
    _items = _items.map(function (item)
    {
        if (item.value === _value)
        {
            ++item.count;
            foundDuplicate = true;
        }
        return item;
    })

    if (!foundDuplicate)
    {
        //add item to the list in local storage
        _items.unshift(newItem);
    }

    //set item to local storage
    localStorage.setItem('list', JSON.stringify(_items));


}
//remove or reduce just one item to local storage
function removeFromLocalStorage(_id)
{
    //get all items from local storage
    let _items = getLocalStorage();

    //filter out the item
    //remove any element that is less than 1
    _items = _items.filter(function (item)
    {

        if (item.id === _id && item.count > 1)
        {
            --item.count
            return item
        }
        else if (item.id !== _id) return item

    })

    localStorage.setItem('list', JSON.stringify(_items));
}
//remove the item array from local storage - empty local storage
function clearLocalStorage()
{
    localStorage.removeItem('list')
}
function getItemFromLocalStorage_ByValue(_value)
{
    let _items = getLocalStorage();
    for (let i = 0; i < _items.length; i++)
        if (_items[i].value === _value)
            return _items[i];
}
function getItemFromLocalStorage_ById(_id)
{
    let _items = getLocalStorage();
    for (let i = 0; i < _items.length; i++)
        if (_items[i].id === _id)
            return _items[i];
}
function updateLocalStorage(_id, newValue)
{
    let _items = getLocalStorage();

    _items = _items.filter((item) =>
    {
        if (item.id === _id)
        {
            item.value = newValue;
        }

        return item
    })

    localStorage.setItem('list', JSON.stringify(_items));


}

/** Dress out HTml items */
function updateItemsToView()
{
    const _items = getLocalStorage();

    // loop thru the local storage item and dress them in html
    for (let i = 0; i < _items.length; i++)
    {
        createHtmlListItem(_items[i].id, _items[i].value, _items[i].count)
    }

    //select buttons
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn')


    //edit button event listener
    editBtns.forEach(function (editBtn)
    {
        editBtn.addEventListener('click', editItem)
    })
    //delet button event listener
    deleteBtns.forEach(function (delBtn)
    {
        delBtn.addEventListener('click', deleteItem)
    })
    setBackDefault()
}