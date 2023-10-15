# Book Swap - Connect and Exchange Books

Book Swap is a web application that allows users to connect with others and exchange books. The platform provides a convenient way for book enthusiasts to share their collections and find books they're interested in.

## Features

- Landing Page: A welcoming landing page with an about section and a contact form to get in touch with the team.
- Authentication: Users can register and log in securely using Firebase Authentication.
- Bookstore: Access to the bookstore is restricted to authenticated users. Unauthorized access displays an error message.
- Book Listings: Browse through a diverse collection of books listed by other users in the bookstore.
- Book Details: Click on a book to view its details, including information fetched from the Google Books API. Users can also see the book's lister and send them a direct email for exchange inquiries.
- User Profiles: Explore user profiles to see all the books they have listed for exchange and their contact information.
- Search Functionality: Utilize the search bar to filter books by name or author, making it easier to find specific titles.
- Profile Management: Users can manage their profiles, update their contact details, and more.
- Book Exchange: List books for exchange within the bookstore, allowing other users to see and express interest in your listings.

## Tech Stack

**Angular:** The core framework for building the web application.

**Typescript:** A typed superset of JavaScript used for building robust applications.

**Tailwind CSS:** A utility-first CSS framework that simplifies styling and enhances responsiveness.

**Firebase:** Provides secure authentication and real-time database capabilities.

**Firestore:** A NoSQL database used to store details and manage CRUD operations throughout the application.

**Spline 3D:** Renders 3D elements on the landing page for a visually appealing experience.

## API Reference

#### Google Books API

Get Book Details by ISBN
Retrieve details of a book using its ISBN.

```http
  GET https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `isbn`    | `string` | **Required** ISBN of the book |

#### OpenStreetMap API

Get Location Suggestions
Retrieve location suggestions based on a query.

```http
  GET https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `query`   | `string` | **Required**. Search query |

#### Dicebear for Avatars

Generate unique avatars using Dicebear.

`https://api.dicebear.com/7.x/micah/svg?seed=${username}`

| Parameter  | Type     | Description                                       |
| :--------- | :------- | :------------------------------------------------ |
| `username` | `string` | **Required**. User's username(generated randomly) |

## Installation

1. Clone the Repository:

```bash
git clone https://github.com/rishabh1S/BookSwap.git
```

2. Navigate to the project directory

```bash
cd book-swap
```

3. Install Dependencies:

```bash
npm install
```

4. Set Up Firebase:

- Create a Firebase project on the Firebase Console.
- Configure Firebase in your Angular project by adding your Firebase configuration details to the src/environments/environment.ts and src/environments/environment.prod.ts files:

```bash
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

5. Start the Development Server

```bash
ng serve
```

## License

[MIT](https://github.com/rishabh1S/BookSwap/blob/main/LICENSE)
