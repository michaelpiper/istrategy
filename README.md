The installation steps you've provided are clear and concise. They outline the necessary actions to set up and run your application. Here's a summarized version:
### requirement:
1. Node 18 // node -v
2. Yarn //yarn -v
3. Redis  // redis-cli
4. Mysql server //mysql -u root -p

once you meet the requirement we are good to go

### Installation Steps:

1. **Install Dependencies:**
   ```
   yarn install
   ```

2. **Build the Application:**
   ```
   yarn build
   ```

3. **Create `.env` File:**
   - Create a file named `.env` in the root folder.
   - Add the following content as an example:
   ```env
   NODE_ENV=development
   DATABASE_URL="mysql://root:password@localhost:3306/1ubank?schema=public"
   REDIS_URI="redis://127.0.0.1:6379"

   # SERVER CONFIG
   PORT=8080
   HOSTNAME=0.0.0.0
   PLATFORM_AUDIENCE=1
   PLATFORM_PUBLIC_KEY=123123
   APP_KEYS='secret key,secret key you used'
   ADMIN_USER_ROOT_EMAIL=test@example.com
   ADMIN_AUTH_PASS=test@example.com
   ADMIN_AUTH_USER=test@example.com
   ```

4. **Run Database Migrations:**
   ```
   yarn migrate
   ```

5. **Seed the Database:**
   ```
   yarn seed
   ```
6. **Run Test:** 
    ```
    yarn test
    ```
7. **Start the Application in Development Mode:**
   ```
   yarn dev
   ```

These steps cover setting up the necessary dependencies, configuring environment variables, and preparing the database for your application, it starts the application in development mode.

Make sure to replace placeholders like `password`, `test@example.com`, etc., with actual values relevant to your application.

NOTE:
You can login to the dashboard with your username and password, test@example.com and test@example.com respectively

{{BASE_URL}}/admin
![image admin](admin.png)

```sql
select article_id as article_no ,currency_name as article,provider_name as provider, article.provider_id as provider_no, price from article left join currency on article.currency_id = currency.currency_id left join provider on article.provider_id = provider.provider_id;
```
+------------+-------------+--------------+-------------+-------+
| article_no | article     |  provider_no |    provider | price |
+------------+-------------+--------------+-------------+-------+
|          1 | EU "Pounds" |            3 | Flutterwave |  1000 |
+------------+-------------+--------------+-------------+-------+

![image drawSQL](drawSQL.png)

[Find Answer Here](ANSWER.md)
