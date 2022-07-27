setupStringListValues = (valueContainer, list = [], id = '', onRemove = (newList) => {}) => {
    list.forEach(l => {
        var itemElement = document.createElement('div');
        itemElement.classList.add('string-list-item');
        var name = document.createElement('span');
        name.classList.add('string-list-item-name_' + id);
        name.textContent = l;
        var remove = document.createElement('i');
        remove.classList.add('material-icons');
        remove.textContent = 'close';
        remove.onclick = (e) => {
            if (l != 'All') {
                e.target.parentElement.remove();
                var newList = list.filter(x => x != l);
                onRemove(newList);
            }
        };
        itemElement.appendChild(name);
        itemElement.appendChild(remove);
        valueContainer.appendChild(itemElement);
    });
}

showStringListModal = (id = '', title = '', currentSelection = [], allValues = [], oncomplete = (list) => {}) => {
    currentSelection = currentSelection.filter(c => c != 'All');
    var modal = document.createElement('div');
    modal.classList.add('modal', 'string-list-modal');
    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    var header = document.createElement('h1');
    header.innerText = title;
    var searchContainer = document.createElement('div');
    searchContainer.classList.add('modal-search');
    var searchInput = document.createElement('input');
    var searchIcon = document.createElement('i');
    searchIcon.classList.add('material-icons');
    searchIcon.textContent = 'search';
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);
    header.appendChild(searchContainer);

    searchInput.oninput = (e) => {
        var elements = document.querySelectorAll('items-container > .string-list-item:not(.selected)');
        Array.from(elements).forEach(a => {
            if (a.textContent.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
                a.classList.remove('hide');
            else 
                a.classList.add('hide');
        })
    }

    var container = document.createElement('items-container');
    var unselected = allValues.filter(a => currentSelection.find(c => a == c) == null);
    allValues = [...currentSelection, ...unselected];
    allValues.forEach(a => {
        var item = document.createElement('div');
        item.classList.add('string-list-item');
        var name = document.createElement('span');
        name.textContent = a;
        var remove = document.createElement('i');
        remove.classList.add('material-icons');
        if (currentSelection.find(c => c == a) != null) {
            item.classList.add('string-list-item-selected_' + id, 'selected');
            remove.textContent = 'close';
        }
        else {
            remove.textContent = 'add';
            item.classList.remove('string-list-item-selected_' + id);
            item.classList.remove('selected');
        }
        item.onclick = (e) => {
            if (currentSelection.includes(a)) {
                currentSelection = currentSelection.filter(c => c != a);
                item.classList.remove('selected');
                item.classList.remove('string-list-item-selected_' + id);
                remove.textContent = 'add';
            }
            else {
                currentSelection.push(a);
                item.classList.add('selected');
                item.classList.add('string-list-item-selected_' + id);
                remove.textContent = 'close';
            }
        };
        item.appendChild(name);
        item.appendChild(remove);
        container.appendChild(item);
    });

    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    var clear = document.createElement('button');
    clear.innerText = 'Clear';
    clear.onclick = () => {
        Array.from(document.querySelectorAll('.string-list-item-selected_' + id + ':not(.hide)')).forEach(a => a.click());
    }

    var all = document.createElement('button');
    all.innerText = 'Select All';
    all.onclick = () => {
        Array.from(document.querySelectorAll('.string-list-item:not(.string-list-item-selected_' + id + '):not(.hide)')).forEach(a => a.click());
    }

    var done = document.createElement('button');
    done.innerText = 'Done';
    done.onclick = () => {
        oncomplete(currentSelection);
        modal.remove();
    };

    buttonContainer.appendChild(done);
    buttonContainer.appendChild(all);
    buttonContainer.appendChild(clear);

    var body = document.getElementsByTagName('body')[0];
    modalContent.appendChild(header);
    modalContent.appendChild(container);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    body.appendChild(modal);
};

stringList = (chart, data, id, container, name = '', initialValues = [], values = (data) => [], filter = () => {}) => {
    var list = initialValues ?? [];
    if (list.length == 0)
        list.push('All');

    container.classList.add('string-list');
    var listContainer = document.createElement('div');
    listContainer.classList.add('string-list-selection-container');
    container.appendChild(listContainer);
    
    var addButton = () => {
        var add = document.createElement('i');
        add.classList.add('material-icons');
        add.textContent = 'add';
        listContainer.appendChild(add);
        add.onclick = () => {
            showStringListModal(
                id, 
                name, 
                Array.from(document.querySelectorAll('.string-list-item-name_' + id)).map(g => g.innerText),
                values(data),
                onChange
            );
        }
    }
    var onChange = (newList) => {
        Array.from(listContainer.querySelectorAll('*')).forEach(a => a.remove());
        if (newList.length == 0)
            newList.push('All');
        setupStringListValues(listContainer, newList, id, onChange);
        addButton();
        document.getElementById('filter-apply').click();
    }

    setupStringListValues(listContainer, list, id, onChange);
    addButton();
    

    return {
        reset: (data) => {
            setupStringListValues(listContainer, [], id, onChange);
        },
        filter: (data) => {
            var selectedValues = Array.from(document.querySelectorAll('.string-list-item-name_' + id))
                .map(m => m.innerText)
                .filter(m => m != 'All');
            return filter(data, selectedValues);
        }
    };
}