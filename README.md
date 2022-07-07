# Store API

1. Here the database has been populated with fake data.
2. There is only one API in this that helps to perform all the search, filter, sorting and pagination queries.
3. After user has requested its requirements, the queries are separated accordingly.
4. Only sorting query is encoded into
   base64 format, rest all are simple requests.
5. Then all the queries are added to an array, and an aggregation pipeline is created which is a feature of MongoDB.
6. Then, all the queries are performed by the Database or to be precise by MongoDB at its end.
7. Then the response is sent to the user.

This is particularly useful when user wants to perform multiple queries according to their needs.

### Technologies Used

1. Node.Js (Back-End)
2. Express.Js (Node.Js Framework)
3. MongoDB (DataBase)