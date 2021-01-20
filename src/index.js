const ramenMenu = document.querySelector('div#ramen-menu');
const ramenDetail = document.querySelector('div#ramen-detail');
const ramenImg = document.querySelector('img.detail-image');
const h2 = document.querySelector('h2.name');
const h3 = document.querySelector('h3.restaurant');
const form = document.querySelector('form#ramen-rating');
const rating = form.querySelector('input[name="rating"]');
const comment = form.querySelector('textarea[name="comment"]');
const deleteBtn = document.querySelector('button.delete');

getAllRamen();
formEvent();


function getAllRamen(){
    fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(arrOfRamen => {
        arrOfRamen.forEach(ramen => renderRamen(ramen))
    })
}

function renderRamen(ramen){
    const img = document.createElement('img');
    img.className = 'ramen-pic';
    img.src = ramen.image;
    img.dataset.id = ramen.id;
    ramenMenu.append(img);
    img.addEventListener('click', function(e){
        fetch(`http://localhost:3000/ramens/${ramen.id}`)
        .then(res => res.json())
        .then(data => {
            rating.value = data.rating;
            comment.textContent = data.comment;
        })
        ramenImg.src = ramen.image;
        ramenImg.alt = ramen.name;
        h2.textContent = ramen.name;
        h3.textContent = ramen.restaurant;
        form.dataset.id = ramen.id;
        
        // rating.value = ramen.rating;
        // comment.textContent = ramen.comment;

        deleteBtn.dataset.id = ramen.id;
    })
}

function formEvent(){
    form.addEventListener('submit', function(e){
        e.preventDefault();
        let newRating = e.target.rating.value;
        let newComment = e.target.comment.value;
        let newRamen = {
            id: e.target.dataset.id,
            rating: newRating,
            comment: newComment
        }
        updateDB(newRamen);
        e.target.reset();
    })
}

function updateDB(newRamen){
    fetch(`http://localhost:3000/ramens/${newRamen.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRamen),
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        rating.value = newRamen.rating;
        comment.textContent = newRamen.comment;
    })
}

// Advanced Deliverables 
const newRamen = document.querySelector('form#new-ramen');
newRamenEvent();
deleteEvent();

function newRamenEvent(){
    newRamen.addEventListener('submit', function(e){
        e.preventDefault();
        const newName = e.target.name.value;
        const newRestaurant = e.target.restaurant.value;
        const newImg = e.target.image.value;
        const newRating = e.target.rating.value;
        const newComment = newRamen.querySelector('textarea[name="new-comment"]').value;
        let freshRamen = {
            name: newName,
            restaurant: newRestaurant,
            image: newImg,
            rating: newRating,
            comment: newComment
        };
        // console.log(freshRamen)
        addToDB(freshRamen);
        e.target.reset();
    })
}

function addToDB(ramen){
    fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ramen),
    })
    .then(res => res.json())
    .then(data => {
        renderRamen(data);
    })
}

function deleteEvent() {
    deleteBtn.addEventListener('click', function(e){
        const ramenId = e.target.dataset.id;
        const ramenIWantToDelete = ramenMenu.querySelector(`img[data-id="${ramenId}"]`)
        ramenMenu.removeChild(ramenIWantToDelete);
        deleteFromDB(ramenId);
        ramenDetail.innerHTML = `
        <div id="ramen-detail">
        <img class="detail-image" src="./assets/ramen/shoyu.jpg" alt="Shoyu Ramen" />
        <h2 class="name">Shoyu Ramen</h2>
        <h3 class="restaurant">Nonono</h3>
        </div>`;
        form.innerHTML = `
        <form id="ramen-rating" data-id="insert ramen ID">
        <label for="rating">Rating: </label>
        <input type="text" name="rating" id="rating" value="Insert Rating Here" />
        <label for="comment">Comment: </label>
        <textarea name="comment" id="comment">Insert Comment Here</textarea>
        <input type="submit" value="Update" />
        </form>`;
    })
}

function deleteFromDB(ramenId){
    fetch(`http://localhost:3000/ramens/${ramenId}`,{
        method: 'DELETE',
    })
}