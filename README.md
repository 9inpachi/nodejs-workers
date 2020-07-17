## Running Tasks

Use `mongorestore -d <db_name> -c users backup/users.bson` to import the users data into your MongoDB instance.

Create an emptry collection named `jobs` in the database.

Make sure to change the db name at [db/db.js:4](https://github.com/9inpachi/nodejs-workers/blob/master/db/db.js#L4) (currently `phlow`) to the db name you imported the collection in.

Both tasks will automatically run when you execute `npm start` or `node app.js`.

### `Task 1`

The task will run automatically on app start and randomly update lastActivity of 10 random users.

**Commits**
* [7ab5520](https://github.com/9inpachi/nodejs-workers/commit/9d3ef3ef132aaac3a38fa15cd1ec83e532c36205)
* [9d3ef3e](https://github.com/9inpachi/nodejs-workers/commit/70b0df28611cc889ed696b6e16035749baba0add)

### `Task 2`

The task will run automatically on app start. For each minute, you will be able to see the number of users under different lastActivity intervals (1-2, 2-3 and 4-5 minutes ago - excluding 3-4 minutes ago). The values will change as the minutes go by. After an interval of 5 minutes, the cycle will restart and you will be able to see the same users again.

Strictly, using `setInterval` ([HERE](https://github.com/9inpachi/nodejs-workers/blob/master/workers/index.js#L58-L63)) will give you the ability to see the same number of users again after 5 minutes interval but since cron uses 0 seconds based minutes, you will not see the same values as lastActivity is supposed to be randomly updated through the first task BUT both are completely valid for actual scenarios.

**Commits**
* [70b0df2](https://github.com/9inpachi/nodejs-workers/commit/b948a3350c61ef1d915588c42cd2319ad456a274)
* [b948a33](https://github.com/9inpachi/nodejs-workers/commit/4c96c363e44b2a5dfd93db9ab75ed582a4c7cf58)

PEACE.

---

Inside the repo you can find a backup folder. The folder has users dump. The `lastActivity` field contains the timestamp 
of the users last activity. Use this time to check for how long the user has been inactive. 

As a part of this test you have to create a Node Script (Javascript Functions) that does the following 2 things.

1. First function updates the last activity time of 10 random users. Take 10 random users' email address from the database and put them into an array passed to/declared inside this function. When this function runs, it updates the last activity time stamp of these users randomply in 3 different ways.

- 1-2 minutes ago. The time stamp you insert is 1-2 minutes ago from now
- 2-3 minutes ago. The time stamp you insert is 2-3 minutes ago from now
- 4-5 minutes ago. The time stamp you insert is 4-5 minutes ago from now

After this function runs, the 10 users selected by you (via emails), will have activity times as either 1-2 minutes ago, 2-3 minutes ago or 4-5 minutes ago, all randomly set. Make sure you do the randomization right, so that results are natural. You will have to develop a Mongo Query to be able to make these changes in the database.


2. This function depicts a worker. It can me a Javascript interval that runs every minute. What it does is that every time it runs, it scans the whole users table and classify the users into 3 different categories. 

- Those who have been inactive in the last 1-2 minutes are put inside an array, or any other datastructure you like. I just want them classified and stored somewhere in the code.
- Those who have been inactive in the last 2-3 minutes
- Those who have been inactive in the last 4-5 minutes

After being inactive for 5 minutes, the cycle restarts. So a user who has been inactive for 6-7 minutes will be classifed as a the same user who has been inactive for 1-2 minutes. Same goes for the users who have been inactive for 7-8 minutes, they will be classified as being inactive for 2-3 minutes. This pattern will go on and you have to create a pattern which determines as to which classification does the user belong. 

When you write the above function, please leep in mind that it will be iterating through the whole users table. If its a worker it will be doing it every minute (in our case) but probably every hour in a production environment. The db for now only has 4-5k users but in a real scenario this number is well above 500k. Make sure you use proper mongo aggregations and do a lot of filtering at the database level instead of bringing the load on the host language, in this case JavaScript. 

Also make sure that you keep both functions separate. Run the first function first, and just once so that you have generated the sample data, and then keep playing with the second function that runs every minute any way. 

Since it is not an API, you can pretty much write all of your code into one file, or ideally break it into multiple importable components. 

The data files are in the backup folder, make sure you back the data into mongo before you start the task.

Good Luck :) 

\# node_task