# merng-postapp-server-GraphQL API

## Reference

- [Classsed - GraphQL Server Series(MERNG)](https://www.youtube.com/playlist?list=PLMhAeHCz8S3_pgb-j51QnCEhXNj5oyl8n)

## Dependence

- [MongoDB](https://www.mongodb.com/cloud/atlas)
- [Apollo-GraphQL](https://www.apollographql.com/docs/tutorial/introduction/)

## Init

```sh
> yarn init

> type NUL > index.js
> type > .gitignore

// .gitignore
node_modules
```

## MongoDB Setup

- 1. New Project : create data storage
- 2. Security : create user / add network access ip

## [Apollo Server](https://www.apollographql.com/docs/apollo-server/getting-started/)

- 1. Install dependencies

```sh
> yarn add apollo-server graphql mongoose
```

- 2. Define your GraphQL schema

```js
// index.js
const { gql } = require('apollo-server');

const typeDefs = gql`
	type Query {
		sayHi: String!
	}
`;
```

- 3. Define your data set

```js
// index.js
const books = [
	{
		title: 'The Awakening',
		author: 'Kate Chopin',
	},
	{
		title: 'City of Glass',
		author: 'Paul Auster',
	},
];
```

- 4. Define a resolver

```js
// index.js
const resolvers = {
	Query: {
		sayHi: () => 'HelloWorld',
	},
};
```

- 5. Create an instance of ApolloServer

```js
// index.js
import { ApolloServer } == require('apollo-server');

const server = new ApolloServer({typeDefs,resolvers});

server.listen().then(({ url }) => {
 console.log(`🚀  Server ready at ${url}`);
});
```

- 6. Start the server

```
> node index.js

🚀 Server ready at http://localhost:4000/
```

- 7. Execute your first query

## mongoDB connect

- 1. master user id/password
- 2. connect > connect your application > connect code

```js
// config.js
module.exports = {
	MONGODB: 'mongodb connect code',
};

// index.js
const mongoose = require('mongoose');
const { MONGODB } = require('./config');

mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB connected!');
		return server.listen({ port: 5000 });
	})
	.then((res) => {
		console.log(`🚀  Server ready at ${res.url}`);
	});
```

## Defined data schema

- user

```js
// models/User.js
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createdAt: String,
});

module.exports = model('User', userSchema);
```

- post

```js
const { model, Schema } = require('mongoose');

const postSchema = new Schema({
	body: String,
	username: String,
	createdAt: String,
	comments: [
		{
			body: String,
			username: String,
			createdAt: String,
		},
	],
	likes: [
		{
			username: String,
			createdAt: String,
		},
	],
	user: {
		type: Schema.Types.ObjectId, // user data를 사용
		ref: 'users',
	},
});

module.exports = model('Post', postSchema);
```

## get data

```js
// index.js
const Post = require('./models/Post');

const typeDefs = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
	}
	type Query {
		getPosts: [Post]
	}
`;

const resolvers = {
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find();
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
```

- dummy data

  <img src="./assets/dummy_data.png" width="60%" height="50%" alt="data"></img>

- get data

  <img src="./assets/call_data.png" width="60%" height="50%" alt="get_data"></img>

## token

```
> yarn add bcryptjs jsonwebtoken
```

## error
