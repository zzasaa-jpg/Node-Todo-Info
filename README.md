# Node_Todo
## Details of stack, third party, programming language
- Fullstack
- Express.js, Mongoose
- Java script
## Website main functionality
This todo application user add, delete, rewrite, read the todo's (CURD) operations. user added to store inside of DB. '/' path render the all todo's. User can performance the CURD operations. Application inside recycle functionality installed. User delete the todo than todo moves to recycle bin inside for restore it with in 2 minutes inside. After 2 minutes todo was automatically deleted by node.js system. This 2 minutes timer running in the backend.

The website wraped with lock system. No one can be access my website. This lock system run in the backend. **Lock system info:** this lock system have 5 times chance for open the lock. User wrong password enter 1 chance was decreased. Untill for chance equal to zero. Chance equal to zero after than start timer for 30 seconds. After 30 seconds you will enter password. Again you wrong password enter than again timer was start for increased timer value. This function will run until the correct password is entered. User enter **correct** password than lock sytem function was **reset**.

<a href="https://node-todo-2-076c.onrender.com/" target="_blank">website link</a>
