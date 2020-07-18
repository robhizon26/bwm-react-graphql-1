// auth
export const reqRegisterUser = registerData => {
    const { username, email, password, passwordConfirmation } = registerData;
    return {
        query: `
        mutation ($username: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
          register(userInput: {username: $username, email: $email, password: $password,passwordConfirmation: $passwordConfirmation}) {
            username
          }
        }
      `,
        variables: {
            username,
            email,
            password,
            passwordConfirmation,
        },
    };
}

export const reqLoginUser = loginData => {
    const { email, password } = loginData;
    return {
        query: `
        query ($email: String!, $password: String!) {
            login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
            }
        }
        `,
            variables: {
                email,
                password,
            },
        };
} 

// bookings
export const reqCreateBooking = booking => {
    const { startAt, endAt, guests, nights, price, rental } = booking;
    return {
        query: `
        mutation ($startAt: String!, $endAt: String!, $guests: Int!, $nights: Int!, $price: Float!, $rentalId: String! ) {
            createBooking(createBookingInput: {startAt: $startAt, endAt: $endAt, guests: $guests, nights: $nights, price: $price, rentalId: $rentalId}) {
            startAt
            endAt
            }
        }
        `,
        variables: {
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        guests,
        nights,
        price,
        rentalId: rental._id,
        },
    };
} 

export const reqGetBookings = rentalId => {
    return {
        query: `
            query ($rentalId: String!) {
            getBookings(rentalId: $rentalId) {
                startAt
                endAt
            }
            }
        `,
        variables: {
            rentalId,
        },
    };
} 

export const reqFetchUserBookings = ()=> {
    return  {
        query: `
          query {
            getUserBookings{
              createdAt
              startAt
              endAt
              nights
              guests
              price
              rental{
                title
                city
                _id
              }
              _id
            }
          }
        `,
      };
} 

export const reqFetchReceivedBookings = ()=> {
    return {
        query: `
          query {
            getReceivedBookings{
              createdAt
              startAt
              endAt
              nights
              guests
              price
              rental{
                title
                city
                _id
              }
              user{
                username
              }
              _id
            }
          }
        `,
      };
} 

export const reqDeleteBooking = bookingId => {
    return  {
        query: `
        mutation ($bookingId: String!) {
            deleteBooking(bookingId: $bookingId) {
              id
            }
          }
        `,
        variables: {
          bookingId,
        },
      };
} 

// rentals
export const reqVerifyRentalOwner = rentalId => {
    return {
        query: `
          query ($rentalId: String!) {
            verifyUser(rentalId: $rentalId) {
              status
            }
          }
        `,
        variables: {
          rentalId,
        },
      };
} 
 
export const reqFetchRentals = location => {
    return  {
        query: `
          query ($city: String!) {
            getRentals(city: $city) {
              category
              city
              dailyPrice
              image
              {
                url
              }
              shared
              title
              _id
            }
          }
        `,
        variables: {
          city: location || "",
        },
      };
} 

export const reqFetchUserRentals = () => {
    return {
        query: `
          query  {
            getUserRentals {
              category
              city
              dailyPrice
              image
              {
                url
              }
              shared
              title
              _id
            }
          }
        `,
      };
} 

export const reqFetchRentalById = rentalId => {
    return {
        query: `
        query ($rentalId: String!) {
          getRentalById(rentalId: $rentalId) {
              category
              city
              dailyPrice
              description
              image
              {
                url
              }
              numOfRooms
              shared
              street
              title
              _id
            }
          }
        `,
        variables: {
          rentalId,
        },
      };
} 

export const reqCreateRental = rental => {
    const {
        title,
        city,
        street,
        category,
        numOfRooms,
        description,
        dailyPrice,
        shared,
        image,
      } = rental;
      return {
        query: `
          mutation ($title: String!, $city: String!, $street: String!, $category: String!, $numOfRooms: Int!, $description: String!, $dailyPrice: Float!, $shared: Boolean, $image: String!)  {
            createRental(createRentalInput:{title: $title, city: $city, street: $street, category: $category, numOfRooms: $numOfRooms, description: $description, dailyPrice: $dailyPrice, shared: $shared, image: $image}) {
              _id
            }
          }
        `,
        variables: {
          title,
          city,
          street,
          category,
          numOfRooms: +numOfRooms,
          description,
          dailyPrice: +dailyPrice,
          shared: !!shared,
          image,
        },
      };
} 


export const reqUpdateRental = (id, rentalData) => {
    const {
        title,
        city,
        street,
        category,
        numOfRooms,
        description,
        dailyPrice,
        shared,
        image
      } = rentalData;
      return {
        query: `
        mutation ($rentalId: String! $title: String, $city: String, $street: String, $category: String, $numOfRooms: Int, $description: String, $dailyPrice: Float, $shared: Boolean, $image: String)  {
          updateRental(updateRentalInput:{rentalId:$rentalId, title: $title, city: $city, street: $street, category: $category, numOfRooms: $numOfRooms, description: $description, dailyPrice: $dailyPrice, shared: $shared, image: $image}) {
              category
              city
              dailyPrice
              description
              image
              {
                url
              }
              numOfRooms
              shared
              street
              title
              _id
            }
          }
        `,
        variables: {
          rentalId: id,
          title,
          city,
          street,
          category,
          numOfRooms: +numOfRooms,
          description,
          dailyPrice: +dailyPrice,
          shared: !!shared,
          image: image && image._id,
        },
      };
} 

export const reqDeleteRental = rentalId => {
    return {
        query: `
        mutation ($rentalId: String!) {
          deleteRental(rentalId: $rentalId) {
              id
            }
          }
        `,
        variables: {
          rentalId,
        },
      };
} 