import {fetchMovieAvailability,fetchMovieList} from "./api.js"

const mainContainerEl = document.querySelector('.main-container')
const seatSeletionContainerEl = document.querySelector('#booker')
const seatSelectionHeader = document.querySelector('#booker>h3')
const seatSelectionBtn = document.querySelector('#book-ticket-btn')
const seatGridHolder = document.querySelector('#booker-grid-holder')
var userSelectedSeats = []

const generateElementAndContent = (elment,content)=>{
    const el = document.createElement(elment)
    if (content) {el.textContent = content}
    return el;
}


const loaderEl = generateElementAndContent('p','loading')
loaderEl.setAttribute('id','loader')


const renderMovies =()=>{
    mainContainerEl.appendChild(loaderEl)

    const movieHolder = generateElementAndContent('div')
    movieHolder.classList.add('movie-holder')

    fetchMovieList()
        .then(listOfMovies =>{
            loaderEl.remove()

            

            listOfMovies.forEach((movie)=>{
                const movieElment = createMovieCard(movie)
                movieHolder.append(movieElment);
            })              
            mainContainerEl.appendChild(movieHolder)
        })
}

const createMovieCard = (movieObj)=>{
    const {name, imgUrl} = movieObj;

    const movieCard = `
                        <a class="movie-link" href="/${name}" >
                          <div class="movie" data-d="${name}">
                            <div class="movie-img-wrapper" style="background-image: url('${imgUrl}'); background-size: cover"></div>
                            <h4>${name}</h4>
                          </div>
                        </a>
                     `

    const movieContainer = generateElementAndContent('div')
    movieContainer.innerHTML=movieCard
    movieContainer.addEventListener('click',(event)=>{
        event.preventDefault();
        const{d} = event.target.parentElement.dataset
        seatAvailability(d)
        
    })
    return movieContainer
}


const seatAvailability = (movieName)=>{
    seatSeletionContainerEl.appendChild(loaderEl)

    fetchMovieAvailability(movieName)
        .then(seats=>{
            loaderEl.remove()
            seatSelectionHeader.classList.remove('v-none')

            while(seatGridHolder.lastChild){
                seatGridHolder.removeChild(seatGridHolder.lastChild)
            }

            generateSeatGrid(seats)
            generateSeatGrid(seats, true)
        })
}

const generateSeatGrid = (availableSeats, flag)=>{
    // flag to generate seats 13 to 24
    const gridWrapper = generateElementAndContent('div')
    gridWrapper.classList.add('booking-grid')
    const nextSeatsValue = flag ? 12:0

    for(let i=1+nextSeatsValue;i<13+nextSeatsValue;i++){
        const seat = generateElementAndContent('div', i)
        seat.setAttribute('id', `booking-grid-${i}`)
        const className = availableSeats.includes(i) ? 'available-seat' : 'unavailable-seat'
        seat.classList.add(className)

        seat.addEventListener('click', handleSeatSelection)
        gridWrapper.append(seat)
    }
    seatGridHolder.append(gridWrapper)
}

const handleSeatSelection = (event)=>{
    const el = event.target

    if (el.classList.contains('available-seat')) {
        el.classList.toggle('selected-seat')
        
    }

    if (el.classList.contains('selected-seat')) {
        userSelectedSeats.push(el.textContent)
        // console.log(userSelectedSeats);
    }else{
        userSelectedSeats = userSelectedSeats.filter(id=>id!==el.textContent)
    }

    if (userSelectedSeats.length>0) {
        seatSelectionBtn.classList.remove('v-none')
        
    }else{
        seatSelectionBtn.classList.add('v-none')
    }
}





const handleBooking = ()=>{
    seatSelectionBtn.classList.add('v-none')
    seatSelectionHeader.classList.add('v-none')
    renderForm();

    document.querySelector('#customer-detail-form').addEventListener('submit', renderSuccessEl)
}
seatSelectionBtn.addEventListener('click',()=>{
    handleBooking()
})

function renderForm() {
    const formElement = `
                        <div id="confirm-purchase">
                            <h3>Confirm your booking for seat numbers:${userSelectedSeats.join(", ")}</h3>
                            <form id="customer-detail-form">
                                <label for="email">Email</label>
                                <input type="email" id="email" required/>
                                <br>
                                
                                <label for="phone">phone No</label>
                                <input type="tel" id="phone" required/>
                                <br>
                                
                                <button type="submit">purchase</button>
                            </form>
                        </div>
                        `
    seatGridHolder.innerHTML =''
    seatGridHolder.innerHTML = formElement;
}
const renderSuccessEl = ()=> {
    const email = document.getElementById('email').value
    const phone = document.getElementById('phone').value

    seatGridHolder.innerHTML = ''

    const successEl = `
                        <div id="success">
                            <h2>Booking details</h2>
                            <div>seats: ${userSelectedSeats.join(", ")}</div>
                            <div>Phone No: ${phone}</div>
                            <div>Email: ${email}</div>
                        </div>
                    `
    seatGridHolder.innerHTML = successEl;
}


renderMovies()

// Add an event listener to the parent element of movie links
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('movie-link')) {
      event.preventDefault(); // Prevent the default redirection behavior
  
      // Perform any other desired actions here
      // For example, you can display a message instead of redirecting
      console.log('Link clicked, but no redirection occurred.');
    }
  });
  