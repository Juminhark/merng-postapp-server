const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

const generateToken = (user) => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
};

module.exports = {
	Mutation: {
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) {
			// TODO: Validate user data

			// TODO: Make sure user doesn't already exist
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError('User is taken', {
					errors: {
						username: `This ${username} is taken`,
					},
				});
			}

			//  TODO:  hash password and create an auth token
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save();

			const token = generateToken(res);

			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};